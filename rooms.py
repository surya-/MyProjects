import sys
import graphene
import mysql.connector as mysql
import qbe_to_sql
import qbe_error_check

                         
class Table(graphene.ObjectType):
    tname = graphene.String()

class Column(graphene.ObjectType):
    cname = graphene.String()
    dtype = graphene.String()

class Qbe(graphene.ObjectType):
    sqlq = graphene.String()
    qresult = graphene.List(graphene.String)

class Queries(graphene.ObjectType):
    tables = graphene.List(Table, dbo=graphene.String(), user=graphene.String(), pswd=graphene.String())
    columns = graphene.List(Column, dbo=graphene.String(), user=graphene.String(), pswd=graphene.String(), dtable=graphene.String())
    qbe = graphene.List(Qbe, dbo=graphene.String(), user=graphene.String(), pswd=graphene.String(), tabparams=graphene.List(graphene.String),  colparams=graphene.List(graphene.String), condparams=graphene.String())

    def resolve_tables(self, info , dbo, user, pswd):
        db = mysql.connect(
            host='localhost',
            database=dbo,
            user=user,
            passwd=pswd,
            auth_plugin='mysql_native_password'
        )
        query = "SELECT table_name FROM information_schema.tables WHERE table_schema = '"+dbo+"'"
        cursor = db.cursor()
        cursor.execute(query)
        records = cursor.fetchall()
        cursor.close()
        db.close()
        #if len(records) == 0:
        #  return ??
        tables = []
        for record in records:
            tables.append(Table(tname=record[0]))
        return tables
    
    def resolve_columns(self, info , dbo, user, pswd,  dtable):
        db = mysql.connect(
            host='localhost',
            database=dbo,
            user=user,
            passwd=pswd,
            auth_plugin='mysql_native_password'
        )
        query = " SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '"+dtable+"' and TABLE_SCHEMA = '"+dbo+"'"
        cursor = db.cursor()
        cursor.execute(query)
        records = cursor.fetchall()
        cursor.close()
        db.close()
        #if len(records) == 0:
        #  return ??
        columns = []
        for record in records:
            columns.append(Column(cname=record[0], dtype=record[1]))
        return columns

    def resolve_qbe(self, info, dbo, user, pswd, tabparams, colparams,condparams):
        db = mysql.connect(
            host='localhost',
            database=dbo,
            user=user,
            passwd=pswd,
            auth_plugin='mysql_native_password'
        )

        query = qbe_to_sql.form_query(tabparams, colparams,condparams)
        print(query)
        cursor = db.cursor()
        cursor.execute(query)
        records = cursor.fetchall()
        cursor.close()
        db.close()
            #if len(records) == 0:
            #  return ??
        qbe = []
        for record in records:
            qbe.append(Qbe(sqlq=query, qresult=record ))
        return qbe

    
        

schema = graphene.Schema(query=Queries)
