import { Event, FilterOperator, FilterValue, LogicOperator, Survey, UserAttributes } from '../types';
import { escapeRegExp } from '../utils';
import { Context, SdkEvent } from './context';

type TargetingEvent = {
  event?: Event;
  attributes?: UserAttributes;
}

function propIn(filterValue: FilterValue, propValue: any): boolean {
  if (!Array.isArray(filterValue)) {
    return false;
  }

  if (typeof propValue === 'string') {
    const tests = filterValue.map(v => {
      const pattern = `^${escapeRegExp(v).replace(/\\\*/g, '.*')}$`;
      return new RegExp(pattern, 'g');
    });
    const filterMatched = tests.reduce(
      (matched, matcher) => matched || matcher.test(String(propValue)),
      false
    );

    return filterMatched;
  } else if (typeof propValue === 'number') {
    return filterValue.indexOf(propValue as any) > -1;
  }

  return false;
}

function propEq(filterValue: FilterValue, propValue: any): boolean {
  return filterValue == propValue;
}

function propContains(filterValue: FilterValue, propValue: any): boolean {
  return String(propValue).includes(String(filterValue));
}

function propStartsWith(filterValue: FilterValue, propValue: any): boolean {
  return String(propValue).startsWith(String(filterValue));
}

function propEndsWith(filterValue: FilterValue, propValue: any): boolean {
  return String(propValue).endsWith(String(filterValue));
}

function propGt(filterValue: FilterValue, propValue: any): boolean {
  return propValue > filterValue;
}

function propLt(filterValue: FilterValue, propValue: any): boolean {
  return propValue < filterValue;
}

function filterMatched(operator: FilterOperator, filterValue: FilterValue, value: any) {
  let isFilterMatched = false;

  switch (operator) {
    case FilterOperator.IS:
      isFilterMatched = propEq(filterValue, value);
      break;
    case FilterOperator.IS_NOT:
      isFilterMatched = !propEq(filterValue, value);
      break;
    case FilterOperator.CONTAINS:
      isFilterMatched = propContains(filterValue, value);
      break;
    case FilterOperator.DOES_NOT_CONTAIN:
      isFilterMatched = !propContains(filterValue, value);
      break;
    case FilterOperator.STARTS_WITH:
      isFilterMatched = propStartsWith(filterValue, value);
      break;
    case FilterOperator.ENDS_WITH:
      isFilterMatched = propEndsWith(filterValue, value);
      break;
    case FilterOperator.GREATER_THAN:
      isFilterMatched = propGt(filterValue, value);
      break;
    case FilterOperator.LESS_THAN:
      isFilterMatched = propLt(filterValue, value);
      break;
    case FilterOperator.IS_FALSE:
      isFilterMatched = value === false;
      break;
    case FilterOperator.IS_TRUE:
      isFilterMatched = value === true;
      break;
    case FilterOperator.HAS_ANY_VALUE:
      isFilterMatched = value !== undefined && value !== null;
      break;
    case FilterOperator.IS_UNKNOWN:
      isFilterMatched = value === undefined || value === null;
      break;
    default:
      console.warn(`Unknown filter operator: ${operator}`);
  }

  return isFilterMatched;
}

function propConditionsMatched(conditions: boolean[], operator: LogicOperator) {
  let conditionMatched = conditions.some(matched => matched);
  if (operator === LogicOperator.AND) {
    conditionMatched = conditions.every(matched => matched);
  }

  return conditionMatched;
}

export class TargetingEngine {
  private eventQueue: TargetingEvent[] = [];
  private eventReceivedCallback?: (e: SdkEvent) => void;

  constructor(ctx: Context, eventReceivedCallback?: (e: SdkEvent) => void) {
    this.eventReceivedCallback = eventReceivedCallback;
    ctx.subscribe('eventTracked', this.handleSdkEvent);
    ctx.subscribe('audienceUpdated', this.handleSdkEvent);
  }

  private handleSdkEvent = (event: SdkEvent) => {
    if (event.type !== 'audienceUpdated') {
      this.eventQueue.push(event.data as TargetingEvent);
    }

    this.eventReceivedCallback?.(event);
  };

  filterSurveys(surveys: Survey[]): Survey[] {
    console.info('Evaluating survey triggers');

    const matchedSurveys = [];
    for (const survey of surveys) {
      for (let i = 0; i < this.eventQueue.length; ++i) {
        const { event, attributes } = this.eventQueue[i];

        if (
          this.triggerMatched(survey, event) &&
          this.evaluateAttributes(survey, attributes)
        ) {
          matchedSurveys.push(survey);
        }
      }
    }

    this.eventQueue = [];

    return matchedSurveys;
  }

  triggerMatched(survey: Survey, event?: Event): boolean {
    if (!event) {
      return false;
    }

    const trigger = survey.trigger;

    if (!trigger?.conditions?.length) {
      return true;
    }

    const condtionsMatch = [];
    for (const condition of trigger.conditions) {
      if (condition.event !== event.event) {
        condtionsMatch.push(false);
        continue;
      }

      if (!condition.filters?.length) {
        condtionsMatch.push(true);
        continue;
      }

      if (!event.properties) {
        condtionsMatch.push(false);
        continue;
      }

      const allPropFiltersMatch = [];
      for (const filter of condition.filters) {
        const { property, operator, value } = filter;

        const propValue = event.properties[property];
        allPropFiltersMatch.push(filterMatched(operator, value, propValue));
      }

      condtionsMatch.push(propConditionsMatched(allPropFiltersMatch, condition.operator));
    }

    return propConditionsMatched(condtionsMatch, LogicOperator.OR);
  }

  evaluateAttributes(survey: Survey, attributes?: UserAttributes): boolean {
    console.info('Evaluating user attributes');

    const audience = survey.audience;

    if (!audience?.filters?.length) {
      return true;
    }

    if (!attributes) {
      return false;
    }

    const allAttributesMatch = [];
    for (const filter of audience.filters) {
      const { attribute, operator, value } = filter;

      const attrValue = attributes[attribute];
      allAttributesMatch.push(filterMatched(operator, value, attrValue));      
    }

    return propConditionsMatched(allAttributesMatch, audience.operator);
  }
}
