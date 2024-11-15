import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { ulid } from 'ulid';

@EventSubscriber()
export class AllEntitySubscriber implements EntitySubscriberInterface {
  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    if (event.metadata.primaryColumns.length !== 1) return;

    const primaryColumn = event.metadata.primaryColumns[0].propertyName;
    event.entity[primaryColumn] = event.entity[primaryColumn] ?? ulid();
  }
}
