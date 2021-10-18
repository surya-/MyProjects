import re

def validate_values(tabparams, colparams):
    error = ""
    for no, i in enumerate(colparams, start=0):
        if tabparams[no].split('.')[0].rsplit('_', 1)[0] == tabparams[no].split('.')[1]:
            if (i != "" ):
                if (i != "P."):
                    error = "Invalid value under table name " + tabparams[no]
                    break
        elif tabparams[no].split('.')[0].rsplit('_', 1)[0] != tabparams[no].split('.')[1]:
            if ( colparams[no] != "" ):
                if re.match("([pP][\.])?[_][a-zA-Z]+?", i ) == None :
                    error = "Invalid value under column name " + tabparams[no]
                    break
    return error
