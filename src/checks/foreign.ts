import * as mysql               from 'mysql2';
import * as db                  from '../db';
import { Observable, Observer } from 'rxjs';
import ICheck                   from '../interfaces/check';

export default class SimpleCheck implements ICheck {
  
  private statement:     string;
  private expectedValue: any;
  
  public constructor(table: string, keyColumn: string, keyValue: any, column: string, value: any) {
    this.statement = mysql.format(
      'SELECT ?? AS "value" FROM ?? WHERE ?? = ?',
      [ column, table, keyColumn, keyValue ]
    );
    this.expectedValue = value;
  }
  
  public check(whereStatements: string[]): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      db.default.query(this.statement, (error, rows: any[]) => {
        if (error) {
          observer.error(error);
        }
        else if (rows.length > 0) {
          var equals = true;
          for (let row of rows) {
            let value = row['value'];
            if (value !== this.expectedValue) {
              equals = false;
              break;
            }
          }
          observer.next(equals);
        }
        else
          observer.next(null);
        
        observer.complete();
      });
    });
  }
  
}
