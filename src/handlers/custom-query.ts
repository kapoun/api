import * as mysql       from 'mysql2';
import EnhancedResponse from '../enhanced-response';
import db               from '../db';

export default class CustomQueryHandler {
  
  private response: EnhancedResponse;
  
  private sql:     string;
  private values_: any[]
  
  private limit:  number;
  private offset: number;
  
  private callback: (records: any[]) => void;
  
  public constructor(response: EnhancedResponse, sql: string) {
    this.response = response;
    this.sql      = sql;
    this.values_  = [];
  }
  
  public values(values: any[]): this {
    this.values_ = values;
    return this;
  }
  
  public limitOffset(limit: number, offset: number): this {
    this.limit  = limit;
    this.offset = offset;
    return this;
  }
  
  public postprocess(callback: (records: any[]) => void): this {
    this.callback = callback;
    return this;
  }
  
  public execute(): void {
    if (this.limit >= 0) {
      this.sql += ' LIMIT ?';
      this.values_.push(this.limit);
      
      if (this.offset > 0) {
        this.sql += ' OFFSET ?';
        this.values_.push(this.offset);
      }
    }
    else if (this.offset > 0) {
      this.sql += ' LIMIT 18446744073709551615 OFFSET ?';
      this.values_.push(this.offset);
    }
    
    db.connection.query(this.sql, this.values_, (error : any, records : any[]) => {
      if (error) {
        let sql = mysql.format(this.sql, this.values_);
        console.error(error);
        console.trace('Query failed: ' + sql);
        return this.response.internalServerError();
      }
      else {
        if (this.callback) {
          try {
            for (let i = 0; i < records.length; i++)
              this.callback(records[i]);
            return this.response.handlers.returnRecords(records);
          }
          catch (e) {
            console.trace(e);
            return this.response.internalServerError();
          }
        }
        else {
          return this.response.handlers.returnRecords(records);
        }
      }
    });
  }
  
}