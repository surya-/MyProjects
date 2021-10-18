import re

def columns_from_tab(tabparams, no, sqlq):
    for i , val in enumerate(tabparams[no+1:], start=no+1):
        if tabparams[i].split('.')[0].rsplit('_', 1)[0] != tabparams[i].split('.')[1]:
            if i == no+1:
                sqlq = sqlq + " " + val  
            else:
                sqlq = sqlq + "," + val 
                print(sqlq)
        else:
            break
    return sqlq
    
def cond_query(tabparams, colparams, condparams, sqlq):
    refvalue1 = ""
    for n, i in enumerate(colparams , start=0):
        if i != "":
            try:
                if re.match("([Pp][\.])?[_][a-zA-Z]+?", i) != None:
                    if len(i.split('.')) == 2:
                        val1 = i.split('.')[1]
                    else:
                        val1 = i
                    refvalue1 = condparams.replace(val1, tabparams[n])
            
                elif (re.match("['][\s\S]+[']", i) != None ) or (isinstance(float(i), float) ) :
                    refvalue2 = tabparams[n] + " = " + i 
                    if refvalue2 != "":
                        sqlq = sqlq + " and " + refvalue2
            except:
                continue
               
    if refvalue1 != condparams:
        sqlq = sqlq + " and " +  refvalue1
    return sqlq
                
                
def join_query(tabparams, colparams, sqlq):
    for n, i in enumerate(colparams , start=0):
        if i != "":
            if re.match("([Pp][\.])?[_][a-zA-Z]+?", i) != None:
                if len(i.split('.')) == 2:
                    val1 = i.split('.')[1]
                else:
                    val1 = i
                for p, j in enumerate(colparams[n+1:], start=n+1):
                    if re.match("([Pp][\.])?[_][a-zA-Z]+?", j) != None:
                        if len(j.split('.')) == 2:
                            val2 = j.split('.')[1]
                        else:
                            val2 = j
                        if val1 == val2:
                            sqlq = sqlq + " " + "and" + " " + tabparams[n] + "="+tabparams[p]
    return sqlq
                            
def form_query(tabparams,colparams,condparams):
    sqlq = "SELECT"
    tablist = []
    print(tabparams)
    print(colparams)
    for no, val in enumerate(colparams, start=0):
        print(tabparams[no].split('.')[0].rsplit('_',1)[0])
        print(tabparams[no].split('.')[1])
        if tabparams[no].split('.')[0].rsplit('_',1)[0] == tabparams[no].split('.')[1]:
            flag = 1
            if val == "P.":
                tablist.append(tabparams[no].split('.')[0])
                flag = 0
                sqlq = columns_from_tab(tabparams, no, sqlq)
        elif re.match( "[pP]\.\w*" , val) != None and tabparams[no].split('.')[0].rsplit('_', 1)[0] != tabparams[no].split('.')[1]:
            print("2nd")
            if colparams[no] != "":
                tablist.append(tabparams[no].split('.')[0])
            if sqlq == "SELECT":
                sqlq = sqlq + " " + tabparams[no]
            else:
                if flag != 0:
                    sqlq = sqlq + "," + tabparams[no]
        elif val != "" and tabparams[no].split('.')[0].split('_', 1)[0] != tabparams[no].split('.')[1]:
                print("3rd")
                tablist.append(tabparams[no].split('.')[0])
                
    sqlq = sqlq + " from "
    tablist = list(set(tablist)) 
    for x in tablist:
        sqlq = sqlq + x.split('_')[0] + " " + x  
        if tablist.index(x) != len(tablist)-1:
            sqlq = sqlq + ", "
    sqlq = sqlq + " where true " 
    sqlq = join_query(tabparams, colparams, sqlq)
    sqlq = cond_query(tabparams, colparams, condparams, sqlq)
    return sqlq