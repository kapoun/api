"use strict";
const mysql = require("mysql2");
const abstract_1 = require("./abstract");
class DeleteHandler extends abstract_1.default {
    constructor(response, table) {
        let statement = mysql.format('DELETE FROM ??', [table]);
        super(response, statement, table);
    }
    where(criteria) {
        return this.createWhereStatement(criteria);
    }
    checkPermission(column, value) {
        return this.addSimpleCheck(column, value);
    }
    checkPermissionWithJoin(joinedTable, using, column, value) {
        return this.addJoinedCheck(joinedTable, using, column, value);
    }
    checkPermissionElsewhere(table, keyColumn, keyValue, column, value) {
        return this.addForeignCheck(table, keyColumn, keyValue, column, value);
    }
    returnResponse(response, result) {
        response.noContent();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteHandler;
//# sourceMappingURL=delete.js.map