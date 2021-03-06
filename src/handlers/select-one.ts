import * as mysql       from 'mysql2';
import db               from '../db';
import EnhancedResponse from '../enhanced-response';
import AbstractHandler  from './abstract';

export default class SelectOneHandler extends AbstractHandler {
  
  public constructor(response: EnhancedResponse, table: string) {
    let statement = mysql.format(
      'SELECT ??.* FROM ??',
      [ table, table ]
    );
    super(response, statement, table);
  }
  
  public joinUsing(joinTable: string, using: string): this {
    return this.createJoinUsingStatement(joinTable, using);
  }

  protected where(criteria: any): this {
    return this.createWhereStatement(criteria);
  }

  protected whereAny(criteria: any): this {
    return this.createWhereStatement(criteria, true);
  }
  
  protected postprocess(callback: (record: any) => void): this {
    return this.setPostprocessor(callback);
  }
  
  protected returnResponse(response: EnhancedResponse, records: any[]): void {
    response.handlers.returnFirstRecord(records);
  }
}

