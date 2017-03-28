var executeStatement, executeStatementBatch, newBatchTransaction;

executeStatement = function(db, sql, values, onsuccess, onerror) {
  if (!!db.executeSql) {
    return db.executeSql(sql, values || [], onsuccess, onerror);
  } else {
    return db.transaction(function(tx) {
      return tx.executeSql(sql, values, function(ignored, rs) {
        return onsuccess(rs);
      }, function(ignored, error) {
        return onerror(error);
      });
    });
  }
};

executeStatementBatch = function(db, statements, onsuccess, onerror) {
  if (!!db.sqlBatch) {
    db.sqlBatch(statements, onsuccess, onerror);
  } else {
    db.transaction(function(tx) {
      var i, len, results, st;
      results = [];
      for (i = 0, len = statements.length; i < len; i++) {
        st = statements[i];
        if (st.constructor === Array) {
          results.push(tx.executeSql(st[0], st[1]));
        } else {
          results.push(tx.executeSql(st));
        }
      }
      return results;
    }, onerror, onsuccess);
  }
};

newBatchTransaction = function(db) {
  var statements;
  statements = [];
  return {
    executeStatement: function(sql, values) {
      if (!statements) {
        throw new Error('Invalid state');
      }
      if (!!values) {
        statements.push([sql, values]);
      } else {
        statements.push(sql);
      }
    },
    abort: function() {
      if (!statements) {
        throw new Error('Invalid state');
      }
      statements = null;
      return Promise.resolve();
    },
    commit: function() {
      var mystatements;
      if (!statements) {
        throw new Error('Invalid state');
      }
      mystatements = statements;
      statements = null;
      return new Promise(function(resolve, reject) {
        executeStatementBatch(db, mystatements, resolve, reject);
      });
    }
  };
};

export var newPromiseHelper = function(db) {
  return {
    executeStatement: function(sql, values) {
      return new Promise(function(resolve, reject) {
        return executeStatement(db, sql, values, resolve, reject);
      });
    },
    newBatchTransaction: function() {
      return newBatchTransaction(db);
    }
  };
};