# this file syncs the data between a selected google sheet and the firebase database
# the link on line 21ish will have to be updated if using a new sheet; the service account associated with the sheet will also have to be given viewing permissions on the new sheet
# this file requires a few pip installs that will require homebrew or similar on Apple devices
# this file has also been updated to be more user friendly, stating any errors that might be encountered between name descrepancies 

import firebase_admin
from firebase_admin import credentials, db
import re
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import datetime

cred = credentials.Certificate("crewAdminSdk.json")
firebase_admin.initialize_app(cred, {"databaseURL": "https://crewattendance-85077-default-rtdb.firebaseio.com/"})
ref = db.reference("/")

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('serviceAccount.json', scope)
client = gspread.authorize(creds)

spreadsheet = client.open_by_url("https://docs.google.com/spreadsheets/d/1637yg0IklQORT3he8Tdq7QgBIfITHuEUgAwKXuy8R-4/edit?gid=1380348819")

worksheet = spreadsheet.sheet1  
data = worksheet.get_all_values()

dayDate =  int(datetime.datetime.now().strftime("%d"))
monthDate = int(datetime.datetime.now().strftime("%m"))

def findPerson(inputString):
    studentName = re.sub(r'[^a-zA-Z\s]', '', inputString.split(" '")[0])
    if ref.child(studentName).key: 
        ref.child(studentName).update({"plannedAbsence": True})
        print("Set ", studentName)
    else:
        print("Couldn't find ", studentName)

for row in data:
    if len(row) > 3 and row[3].strip() != "":
        inputDate = row[3].split("/")
        
        if len(inputDate) == 3:
            inputDay = int(inputDate[1])
            inputMonth = int(inputDate[0])

            if (inputDay == dayDate) and (inputMonth == monthDate):
                findPerson(row[2])
        
       


 
