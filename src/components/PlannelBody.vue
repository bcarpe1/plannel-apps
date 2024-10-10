<template>
    <section style="padding: 10px 20px">
      <div>
        <div v-for="week in weeksWithinMonth" :key="week.dates[0].getDate()">
          <div style="width:865px; padding: 0; margin-top: 10px; border-radius: 5px; background: rgba(256,256,256,0.75); box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.5)">
            <div>
              <table>
                <tr>
                  <td>
                    <table>
                      <tr>
                        <td>
                          <table>
                            <tr>
                              <th style="text-align: left; width: 25px;"></th>
                              <th style="text-align: left; width: 120px;">Start Time</th>
                              <th style="text-align: left; width: 60px;">Hours</th>
                              <th style="text-align: left; width: 60px;"></th>
                              <th style="text-align: left; width: 100px;">Project</th>
                              <th style="text-align: left; width: 100px;">Task</th>
                              <th style="text-align: left; width: 300px;" colspan="2">Note</th>
                              <th style="width: 50px;"></th>
                            </tr>
                          </table>
                        </td>
                        <td  style="position: relative">
                          <table style="position: absolute; top:-15px; left:40px; padding:10px; border-radius: 5px; background: rgba(256,256,256,0.75); box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.5)">
                            <tr>
                              <th style="text-align: left; width: 100px;">Project</th>
                              <th style="text-align: left; width: 100px;">Task</th>
                              <th style="text-align: left; width: 60px;">Hours</th>
                              <th style="text-align: left; width: 60px;"></th>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <div v-for="date in week.dates" :key="date.getDate()" style="border-top: solid 1px">
              <table style="border-collapse: collapse; border-spacing: 0;">
                <tr style="border-collapse: collapse; border-spacing: 0;">
                  <td style="padding: 0; vertical-align: top;">
                    <table style="border-collapse: collapse; border-spacing: 0;">
                      <tr style="border-collapse: collapse; border-spacing: 0;">
                        <td style="padding: 0; vertical-align: top;">
                          <table v-if="(timeEntriesForDate(date)).length" id="timeentries">
                            <tr>
                              <td></td>
                              <td v-if="allTimeEnteredForDate(date)"><font-awesome-icon icon="fa-solid fa-check-square" /></td>
                              <td v-if="!allTimeEnteredForDate(date)"><font-awesome-icon icon="fa-solid fa-square" /></td>
                              <td colspan="8" style="font-weight: 600; font-size: large">{{displayDayOfWeek[date.getDay()]}} - {{date.getMonth()+1}}/{{date.getDate()}}</td>
                            </tr>
                            <tr v-for="(timeEntry) in timeEntriesForDate(date)" :key="timeEntry.id" class="timeEntry">
                              <td></td>
                              <td v-if="!timeEntry.editing && timeEntry.entered" @click="toggleEntered(timeEntry)" style="width: 25px; vertical-align: middle"><font-awesome-icon icon="fa-solid fa-check-square" /></td>
                              <td v-if="!timeEntry.editing && !timeEntry.entered" @click="toggleEntered(timeEntry)" style="width: 25px; vertical-align: middle"><font-awesome-icon icon="fa-solid fa-square" /></td>
                              <td v-if="!timeEntry.editing" @click="editTimeEntry(timeEntry)" style="width: 120px; cursor: pointer;" class="label">{{ timeFromDateDisplay(new Date(timeEntry.startTime)) }}</td>
                              <td v-if="!timeEntry.editing" @click="editTimeEntry(timeEntry)" style="width: 60px; cursor: pointer;" class="label">{{ displayHoursTime(timeEntry.duration) }}</td>
                              <td v-if="!timeEntry.editing" @click="editTimeEntry(timeEntry)" style="width: 60px; cursor: pointer;" class="label">{{ displayHoursDecimal(timeEntry.duration) }}</td>
                              <td v-if="!timeEntry.editing && timeEntry.projectCode" style="width: 25px; cursor: pointer; vertical-align: middle; padding-top: 5px;"><font-awesome-icon icon="fa-solid fa-copy" @click="copyToClipboard(timeEntry.projectCode)"/></td>
                              <td v-if="!timeEntry.editing && !timeEntry.projectCode" @click="editTimeEntry(timeEntry)" style="width: 25px; cursor: pointer"></td>
                              <td v-if="!timeEntry.editing" @click="editTimeEntry(timeEntry)" style="width: 75px; cursor: pointer;" class="label">{{ timeEntry.projectCode }}</td>
                              <td v-if="!timeEntry.editing && timeEntry.storyRef" style="width: 25px; cursor: pointer; vertical-align: middle; padding-top: 5px;"><font-awesome-icon icon="fa-solid fa-copy" @click="copyToClipboard(timeEntry.storyRef)"/></td>
                              <td v-if="!timeEntry.editing && !timeEntry.storyRef" @click="editTimeEntry(timeEntry)" style="width: 25px; cursor: pointer"></td>
                              <td v-if="!timeEntry.editing" @click="editTimeEntry(timeEntry)" style="width: 75px; cursor: pointer;" class="label">{{ timeEntry.storyRef }}</td>
                              <td v-if="!timeEntry.editing && timeEntry.note" style="width: 25px; cursor: pointer; vertical-align: middle; padding-top: 5px;"><font-awesome-icon icon="fa-solid fa-copy" @click="copyToClipboard(timeEntry.note)"/></td>
                              <td v-if="!timeEntry.editing && !timeEntry.note" @click="editTimeEntry(timeEntry)" style="width: 25px; cursor: pointer"></td>
                              <td v-if="!timeEntry.editing" @click="editTimeEntry(timeEntry)" style="width: 275px; cursor: pointer;" class="label">{{ timeEntry.note }}</td>
                              <td v-if="!timeEntry.editing" style="width: 50px; vertical-align: middle"><font-awesome-icon icon="fa-solid fa-minus-circle" @click="removeTimeEntry(timeEntry)"/></td>
                              <td v-if="timeEntry.editing && timeEntry.tempEntered" @click="toggleEntered(timeEntry)" style="width: 25px; vertical-align: middle"><font-awesome-icon icon="fa-solid fa-check-square" /></td>
                              <td v-if="timeEntry.editing && !timeEntry.tempEntered" @click="toggleEntered(timeEntry)" style="width: 25px; vertical-align: middle"><font-awesome-icon icon="fa-solid fa-square" /></td>
                              <td v-if="timeEntry.editing" style="width: 120px; vertical-align: top; padding-top: 5px;"><input class="control" type="time" v-model="timeEntry.tempStartTime" v-on:input="setStartTime($event, timeEntry)" v-on:keydown.enter="saveEdits(timeEntry)" style="width: 110px;"/></td>
                              <td v-if="timeEntry.editing" style="width: 60px;"></td>
                              <td v-if="timeEntry.editing" style="width: 60px;"></td>
                              <td v-if="timeEntry.editing" style="width: 25px; cursor: pointer; vertical-align: middle; padding-top: 5px;"><font-awesome-icon icon="fa-solid fa-copy" @click="copyToClipboard(timeEntry.tempProjectCode)"/></td>
                              <td v-if="timeEntry.editing" style="width: 75px; vertical-align: top; padding-top: 5px;"><input class="control" v-model="timeEntry.tempProjectCode" v-on:input="setProjectCode($event, timeEntry)" v-on:keydown.enter="saveEdits(timeEntry)" style="width: 65px;"/></td>
                              <td v-if="timeEntry.editing" style="width: 25px; cursor: pointer; vertical-align: middle; padding-top: 5px;"><font-awesome-icon icon="fa-solid fa-copy" @click="copyToClipboard(timeEntry.tempStoryRef)"/></td>
                              <td v-if="timeEntry.editing" style="width: 75px; vertical-align: top; padding-top: 5px;"><input class="control" v-model="timeEntry.tempStoryRef" v-on:input="setStoryRef($event, timeEntry)" v-on:keydown.enter="saveEdits(timeEntry)" style="width: 65px;"/></td>
                              <td v-if="timeEntry.editing" style="width: 25px; cursor: pointer; vertical-align: middle; padding-top: 5px;"><font-awesome-icon icon="fa-solid fa-copy" @click="copyToClipboard(timeEntry.tempNote)"/></td>
                              <td v-if="timeEntry.editing" style="width: 275px; vertical-align: top; padding-top: 5px;"><textarea class="control" v-model="timeEntry.tempNote" v-on:input="setNote($event, timeEntry)" v-on:keydown.enter="saveEdits(timeEntry)" style="width: 265px; resize: vertical;"></textarea></td>
                              <td v-if="timeEntry.editing" style="width: 50px; vertical-align: middle"><font-awesome-icon icon="fa-solid fa-check-square" @click="saveEdits(timeEntry)"/><font-awesome-icon style="margin-left: 5px;" icon="fa-solid fa-ban" @click="cancelEdit(timeEntry)"/></td>
                            </tr>
                            <tr>
                              <td style="width: 25px;"></td>
                              <td><font-awesome-icon icon="fa-solid fa-plus-circle" @click="addNewEntry(date)" /></td>
                            </tr>
                          </table>
                          <table v-if="(timeEntriesForDate(date)).length === 0">
                            <tr>
                              <td></td>
                              <td><font-awesome-icon icon="fa-solid fa-check-square" /></td>
                              <td colspan="8" style="font-weight: 600; font-size: large">{{displayDayOfWeek[date.getDay()]}} - {{date.getMonth()+1}}/{{date.getDate()}}</td>
                            </tr>
                            <tr>
                              <td></td>
                              <td style="width: 25px;"></td>
                              <td style="width: 120px;"></td>
                              <td style="width: 60px;"></td>
                              <td style="width: 60px;"></td>
                              <td style="width: 100px;"></td>
                              <td style="width: 100px;"></td>
                              <td style="width: 300px;"></td>
                              <td style="width: 50px;"></td>
                            </tr>
                            <tr>
                              <td style="width: 25px;"></td>
                              <td><font-awesome-icon icon="fa-solid fa-plus-circle" @click="addNewEntry(date)" /></td>
                            </tr>
                          </table>
                        </td>
                        <td style="vertical-align: top; position: relative">
                          <table id="daysummary" style="width:200px; position: absolute; top:0; left:40px; padding:0; padding-left:10px; border-radius: 5px; background: rgba(256,256,256,0.75); box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.5)">
                            <tr v-for="daySummary in daySummariesForDate(date)" :key="daySummary.id">
                              <td style="width: 100px;">{{ daySummary.projectCode }}</td>
                              <td style="width: 100px;">{{ daySummary.storyRef }}</td>
                              <td style="width: 60px;">{{ displayHoursTime(daySummary.durationMin) }}</td>
                              <td style="width: 60px;">{{ displayHoursDecimal(daySummary.durationMin) }}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div style="width:865px; padding:10px; margin-top: 10px; border-radius: 5px; background: rgba(256,256,256,0.75); box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.5)">
            <label>Summary of Week Ending {{displayDayOfWeek[week.lastDate]}} - {{week.lastDate.getMonth()+1}}/{{week.lastDate.getDate()}}</label>
            <table id="weeksummary">
              <tr>
                <th style="text-align: left; width: 100px;">Project</th>
                <th style="text-align: left; width: 100px;">Hours</th>
                <th style="text-align: left; width: 100px;"></th>
              </tr>
              <tr v-for="weekSummary in week.summary" :key="weekSummary.id">
                <td>{{ weekSummary.projectCode }}</td>
                <td>{{ displayHoursTime(weekSummary.durationMin) }}</td>
                <td>{{ displayHoursDecimal(weekSummary.durationMin) }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div style="margin-top: 5px">
        <button style="margin-left: 5px" @click="convertBackToLocalClicked()">Convert Back to Local</button>
      </div>
      <div style="margin-top: 5px">
        <input v-model="userGuid" :disabled="isSynced()"/>
        <button style="margin-left: 5px" @click="syncButtonClicked()">{{getSyncButtonText()}}</button>
      </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PlannelBody',
  data() {
    const date = new Date();

    return {
      timeEntryList: [],
      dateStartTimes: [],
      month: date.getMonth()+1,
      year: date.getFullYear(),
      editEntries: [],
      userGuid: "",
      synced: false
    };
  },
  mounted() {
    if(localStorage.timeEntryList && localStorage.timeEntryList != "null") {

        this.timeEntryList = JSON.parse(localStorage.timeEntryList);

        let timeEntryListMonth = [];
        let currentYear = null;
        let currentMonth = null;
        let startTime = null;
        this.timeEntryList.forEach(function(timeEntry) {
          startTime = new Date(timeEntry.startTime);
          var year = startTime.getFullYear();
          var month = startTime.getMonth() + 1;

          if(year != currentYear || month != currentMonth) {
            if(currentYear && currentMonth) {
              localStorage.setItem(`${currentYear}-${currentMonth}`, JSON.stringify(timeEntryListMonth));
            }

            currentYear = year;
            currentMonth = month;
            timeEntryListMonth = [];
          }

          timeEntryListMonth.push(timeEntry);
        });
        
        if(currentYear && currentMonth) {
          localStorage.setItem(`${currentYear}-${currentMonth}`, JSON.stringify(timeEntryListMonth));
        }
    }

    let startTime = new Date();
    this.month = startTime.getMonth() + 1;
    this.year = startTime.getFullYear();
    this.userGuid = localStorage.userGuid;
    if(localStorage.synced && localStorage.synced != "false") {
      this.synced = localStorage.synced;
    }
    if(localStorage.accountId && localStorage.accountId != "undefined") {
      this.accountId = parseInt(localStorage.accountId);
    }
    if(localStorage.timeSheetId && localStorage.timeSheetId != "undefined") {
      this.timeSheetId = parseInt(localStorage.timeSheetId);

      this.loadTimeSheetCurrentMonth(this.timeSheetId);
    }
    else {
      if(Object.prototype.hasOwnProperty.call(localStorage,`${this.year}-${this.month}`)) {
        this.timeEntryList = JSON.parse(localStorage[`${this.year}-${this.month}`]);
        for(let i = 0; i < this.timeEntryList.length; i++) {
          this.timeEntryList[i].duration = this.getTimeEntryDurationMin(this.timeEntryList[i]);
        }
      }
      else {
        this.timeEntryList = [];
      }
    }

    this.emitter.on("changeMonth", (data) => {
      const newMonth = data.msg;
      this.month=newMonth;
      if(this.synced) {
        this.loadTimeSheetCurrentMonth(this.timeSheetId);
      }
      else {
        if(Object.prototype.hasOwnProperty.call(localStorage,`${this.year}-${newMonth}`)) {
          this.timeEntryList = JSON.parse(localStorage[`${this.year}-${newMonth}`]);
          for(let i = 0; i < this.timeEntryList.length; i++) {
            this.timeEntryList[i].duration = this.getTimeEntryDurationMin(this.timeEntryList[i]);
          }
        }
        else {
          this.timeEntryList = [];
        }
      }
    })

    this.emitter.on("changeYear", (data) => {
      const newYear = data.msg;
      this.year=newYear;
      if(this.synced) {
        this.loadTimeSheetCurrentMonth(this.timeSheetId);
      }
      else {
        if(Object.prototype.hasOwnProperty.call(localStorage,`${newYear}-${this.month}`)) {
          this.timeEntryList = JSON.parse(localStorage[`${newYear}-${this.month}`]);
          for(let i = 0; i < this.timeEntryList.length; i++) {
            this.timeEntryList[i].duration = this.getTimeEntryDurationMin(this.timeEntryList[i]);
          }
        }
        else {
          this.timeEntryList = [];
        }
      }
      console.log (this.timeEntryList);
    })
  },
  methods: {
    async getData() {
      try {
        console.log(process.env.VUE_APP_BACKEND_URL);
        await axios.get(
          `${process.env.VUE_APP_BACKEND_URL}/timeEntries/${this.userGuid}`
        ).then((response) => {
          this.timeEntries = response.data;
          console.log(this.timeEntries);
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async setData() {
      try {
        var timeEntries = this.timeEntryList.map(x => {
          return {
            timeentry: {
              account_id: 44,
              time_sheet_id: 22,
              starttime: new Date(x.startTime),
              ref1: x.projectCode,
              ref2: x.storyRef,
              note: x.note
              }
            }
          });
        await axios.post(`${process.env.VUE_APP_BACKEND_URL}/timeEntries`, {
            userguid: this.userGuid,
            timeentries : timeEntries
          }
        ).then((response) => {
          console.log(response);
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async createNewUserAccount() {
      try {
        var timeEntriesAll = [];
        for(var yr = 2020; yr <= 9999; yr++) {
          for(var mon = 1; mon <= 12; mon++) {
            if(Object.prototype.hasOwnProperty.call(localStorage,`${yr}-${mon}`)) {
              var curTimeEntryList = JSON.parse(localStorage[`${yr}-${mon}`]).map(x => {
              return {
                timeentry: {
                  starttime: new Date(x.startTime),
                  ref1: x.projectCode,
                  ref2: x.storyRef,
                  note: x.note,
                  time_marked: x.entered
                  }
                }
              });
              timeEntriesAll.push(...curTimeEntryList);
            }
          }
        }
        await axios.post(`${process.env.VUE_APP_BACKEND_URL}/account/initializeWithData`, {
            timeentries : timeEntriesAll
          }
        ).then((response) => {
          this.synced = true;
          this.userGuid = response.data.account.userguid;
          this.accountId = response.data.account.id;
          this.timeSheetId = response.data.timeSheet.id;
          this.setSyncVariablesFromMemory();
          this.loadTimeSheetCurrentMonth(this.timeSheetId);
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async syncWithAccount() {
      try {
        console.log(process.env.VUE_APP_BACKEND_URL);
        await axios.post(`${process.env.VUE_APP_BACKEND_URL}/timeSheet/loadTimeSheetsByGuid`, {
            guid : this.userGuid
          }
        ).then((response) => {
          this.synced = true;
          this.timeSheets = response.data.timeSheets;
          this.timeSheets = this.timeSheets && this.timeSheets.length ?
                            this.timeSheets.sort((a, b) => a.id - b.id) :
                            this.timeSheets;
          this.timeSheetId = this.timeSheets[this.timeSheets.length - 1].id;
          this.accountId = this.timeSheets[this.timeSheets.length - 1].account_id;
          this.setSyncVariablesFromMemory();
          this.loadTimeSheetCurrentMonth(this.timeSheetId);
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async changeSyncAccount() {
      this.userGuid = "";
      this.synced = false;
      localStorage.synced = false;
      this.accountId = undefined;
      localStorage.accountId = undefined;
      this.timeSheetId = undefined;
      localStorage.timeSheetId = undefined;
    },
    async loadTimeSheetCurrentMonth(timesheetID) {
      try {
        const firstDayOfMonth = new Date(this.year, this.month-1, 1);
        const lastDayOfMonth = new Date(this.year, this.month, 0);
        
        const firstSecond = `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth()+1}-${firstDayOfMonth.getDate()} 00:00:00`;
        const lastSecond = `${lastDayOfMonth.getFullYear()}-${lastDayOfMonth.getMonth()+1}-${lastDayOfMonth.getDate()} 23:59:59`;

        await axios.post(`${process.env.VUE_APP_BACKEND_URL}/timeEntry/loadTimeEntries`, {
          userguid: this.userGuid,
          timeSheetId: timesheetID,
          startDate: firstSecond,
          endDate: lastSecond
        }).then((response) => {
          this.response = response;
          this.timeEntryList = response.data.timeEntries.map(x => { 
            return { 
              editing: false,
              id:x.id, 
              new: false,
              note: x.note, 
              projectCode: x.ref1, 
              startTime: new Date(x.starttime).getTime(), 
              storyRef: x.ref2,
              tempNote: x.note,
              tempProjectCode: x.ref1,
              tempStartTime: new Date(x.starttime).getTime(), 
              tempStoryRef: x.ref2,
              entered: x.time_marked
            } 
          });
          this.timeEntryList.sort((x,y) => x.startTime < y.startTime ? -1 : 1);
          for(let i = 0; i < this.timeEntryList.length; i++) {
            this.timeEntryList[i].duration = this.getTimeEntryDurationMin(this.timeEntryList[i]);
          }
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async loadTimeSheetAllTime(timesheetID) {
      try {
        const firstDayOfMonth = new Date(2020, 0, 1);
        const lastDayOfMonth = new Date(9999, 11, 31);
        
        const firstSecond = `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth()+1}-${firstDayOfMonth.getDate()} 00:00:00`;
        const lastSecond = `${lastDayOfMonth.getFullYear()}-${lastDayOfMonth.getMonth()+1}-${lastDayOfMonth.getDate()} 23:59:59`;

        await axios.post(`${process.env.VUE_APP_BACKEND_URL}/timeEntry/loadTimeEntries`, {
          userguid: this.userGuid,
          timeSheetId: timesheetID,
          startDate: firstSecond,
          endDate: lastSecond
        }).then((response) => {
          this.response = response;
          this.timeEntryList = response.data.timeEntries.map(x => { 
            return { 
              editing: false,
              id:x.id, 
              new: false,
              note: x.note, 
              projectCode: x.ref1, 
              startTime: new Date(x.starttime).getTime(), 
              storyRef: x.ref2,
              tempNote: x.note,
              tempProjectCode: x.ref1,
              tempStartTime: new Date(x.starttime).getTime(), 
              tempStoryRef: x.ref2,
              entered: x.time_marked
            } 
          });
          this.timeEntryList.sort((x,y) => x.startTime < y.startTime ? -1 : 1);
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async convertBackToLocal() {
      try {
        console.log(process.env.VUE_APP_BACKEND_URL);
        await axios.post(`${process.env.VUE_APP_BACKEND_URL}/timeSheet/loadTimeSheetsByGuid`, {
            guid : this.userGuid
          }
        ).then(async response => {
          this.timeSheets = response.data.timeSheets;
          this.timeSheets = this.timeSheets && this.timeSheets.length ?
                            this.timeSheets.sort((a, b) => a.id - b.id) :
                            this.timeSheets;
          this.timeSheetId = this.timeSheets[this.timeSheets.length - 1].id;
          this.accountId = this.timeSheets[this.timeSheets.length - 1].account_id;
          await this.loadTimeSheetAllTime(this.timeSheetId);

          for(var yr = 2020; yr <= 9999; yr++) {
            for(var mon = 1; mon <= 12; mon++) {
              if(this.timeEntryList.filter(x => new Date(x.startTime).getFullYear() == yr && new Date(x.startTime).getMonth() == mon-1).length) {
                var curTimeEntryList = this.timeEntryList.filter(x => new Date(x.startTime).getFullYear() == yr && new Date(x.startTime).getMonth() == mon-1);
                  localStorage[`${yr}-${mon}`] = JSON.stringify(curTimeEntryList);
              }
            }
          }      
          this.userGuid = "";
          localStorage.userGuid = "";
          this.synced = false;
          localStorage.synced = false;
          this.accountId = undefined;
          localStorage.accountId = undefined;
          this.timeSheetId = undefined;
          localStorage.timeSheetId = undefined;
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async createTimeEntry(timeEntry) {
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND_URL}/timeEntry`, {
          timeentry: 
          {
            time_sheet_id: this.timeSheetId,
            account_id: this.accountId,
            starttime: new Date(timeEntry.startTime),
            ref1: timeEntry.projectCode,
            ref2: timeEntry.storyRef,
            note: timeEntry.note,
            time_marked: timeEntry.entered
          },
          userguid: this.userGuid
        }).then((response) => {
          timeEntry.id = response.data.timeEntry.id;
        }).catch(error => {
            console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async updateTimeEntry(timeEntry) {
      try {
        await axios.put(`${process.env.VUE_APP_BACKEND_URL}/timeEntry/${timeEntry.id}/${this.userGuid}`, {
          timeentry: 
          {
            time_sheet_id: this.timeSheetId,
            account_id: this.accountId,
            starttime: new Date(timeEntry.startTime),
            ref1: timeEntry.projectCode,
            ref2: timeEntry.storyRef,
            note: timeEntry.note,
            time_marked: timeEntry.entered
          }
        }).catch(error => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteTimeEntry(timeEntry) {
      try {
      await axios.delete(`${process.env.VUE_APP_BACKEND_URL}/timeEntry/${timeEntry.id}/${this.userGuid}`).catch(error => {
          console.log(error);
      });
      } catch (error) {
        console.log(error);
      }
    },
    addNewEntry(date) {
      let id = 0;
      if(!this.synced && this.timeEntryList && this.timeEntryList.length) {
        id = Math.max(...(this.timeEntryList.map(x => x.id))) + 1;
      }
      let startTime = date.getTime();
      let currentDate = new Date();
      startTime += (Date.now() - currentDate.getTimezoneOffset() * 60000) % 86400000;
      this.timeEntryList.push({
        id: id,
        startTime: startTime,
        tempStartTime: this.timeFromDate(new Date(startTime)),
        editing: true,
        entered: false,
        new: true
      });
    },
    allTimeEnteredForDate(date) {
      let list = this.timeEntryList
        .filter((x) => (
          date.getTime() <= x.startTime &&
          date.getTime() + 86400000 > x.startTime
        ));

      return list.filter(x => (!x.entered && !x.editing) || (!x.tempEntered && x.editing)).length == 0;
    },
    cancelEdit(timeEntry) {
      if(timeEntry.new) {
        const index = this.timeEntryList.indexOf(timeEntry);
        this.timeEntryList.splice(index,1);
      }
      else
      {
        timeEntry.editing = false;
      }
    },
    convertBackToLocalClicked() {
      if(this.userGuid != "" && this.userGuid && this.synced) {
        // Pull all data and convert to local
        this.convertBackToLocal();
      }
    },
    copyToClipboard(textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    },
    daySummariesForDate(date) {
      const daysEntries = this.timeEntryList
        .filter((x) => (
          date.getTime() <= x.startTime &&
          date.getTime() + 86400000 > x.startTime
        ));
      let summaries = [];
      let totalHours = 0;
      for(var i = 0; i < daysEntries.length; i++) {
        const entry = daysEntries[i];
        if(!entry.projectCode) continue;
        const id = `${entry.projectCode}-${entry.storyRef}`;
        let summary = summaries.find(summary => summary.id === id);
        totalHours += entry.duration;
        if(summary === undefined) {
          summaries.push (
            { 
              id,
              projectCode: entry.projectCode,
              storyRef: entry.storyRef,
              durationMin: entry.duration
            }
          );
        }
        else {
          summary.durationMin += entry.duration;
        }
      }
      summaries.push (
        { 
          id: 'Total',
          projectCode: 'Total',
          durationMin: totalHours
        }
      );
      return summaries;
    },
    removeTimeEntry(timeEntry) {
      const index = this.timeEntryList.indexOf(timeEntry);
      this.timeEntryList.splice(index,1);
      if(this.synced) {
        this.deleteTimeEntry(timeEntry);
      }
      else {
        localStorage[`${this.year}-${this.month}`] = JSON.stringify(this.timeEntryList);
      }
    },
    editTimeEntry(timeEntry) {
      timeEntry.editing = true;
      const startTime = new Date(timeEntry.startTime);
      timeEntry.tempStartTime = this.timeFromDate(startTime);
      timeEntry.tempEntered = timeEntry.entered;
    },
    getSyncButtonText() {
      if(!this.synced) {
        if(this.userGuid == "" || !this.userGuid) return "Create a new User Account";
        else return "Sync with Account";
      }
      else {
        return "Change Sync Account";
      }
    },
    getTimeEntryDurationMin(timeEntry) {
      const index = this.timeEntryList.indexOf(timeEntry);
      if(index == this.timeEntryList.length-1) {
        return 0;
      }

      const nextTimeEntry = this.timeEntryList[index+1];
      if(new Date(timeEntry.startTime).getDate() != new Date(nextTimeEntry.startTime).getDate()) {
        return 0;
      }

      return (nextTimeEntry.startTime - timeEntry.startTime)/60000;
    },
    isSynced() {
      return this.synced;
    },
    saveEdits(timeEntry) {
      timeEntry.editing = false;
      if(timeEntry.tempStartTime) {
        const startTime = timeEntry.tempStartTime;
        const hour = startTime.substring(0,startTime.indexOf(":"));
        const minute = startTime.substring(startTime.indexOf(":")+1);
        const originalStartTime = new Date(timeEntry.startTime);
        timeEntry.tempStartTime = new Date(originalStartTime.getFullYear(), originalStartTime.getMonth(), originalStartTime.getDate(), parseInt(hour), parseInt(minute));
        timeEntry.startTime = timeEntry.tempStartTime.getTime();
      }
      timeEntry.projectCode = timeEntry.tempProjectCode;
      timeEntry.storyRef = timeEntry.tempStoryRef;
      timeEntry.note = timeEntry.tempNote;
      timeEntry.entered = timeEntry.tempEntered;
      timeEntry.new = false;
      
      this.timeEntryList.sort((x,y) => x.startTime < y.startTime ? -1 : 1);
      for(let i = 0; i < this.timeEntryList.length; i++) {
        this.timeEntryList[i].duration = this.getTimeEntryDurationMin(this.timeEntryList[i]);
      }
      if(!this.synced) {
        localStorage[`${this.year}-${this.month}`] = JSON.stringify(this.timeEntryList);
      }
      else {
        if(timeEntry.id == 0) {
          this.createTimeEntry(timeEntry);
        }
        else {
          this.updateTimeEntry(timeEntry);
        }
      }
    },
    setStartTime(event, timeEntry) {
      timeEntry.tempStartTime = event.target.value;
    },
    setSyncVariablesFromMemory() {
      localStorage.timeSheetId = this.timeSheetId;
      localStorage.accountId = this.accountId;
      localStorage.userGuid = this.userGuid;
      localStorage.synced = this.synced;
    },
    setDurationHours(event, timeEntry) {
      timeEntry.tempDurationTime = event.target.value;
    },
    setDurationDecimal(event, timeEntry) {
      timeEntry.tempDurationDecimal = event.target.value;
    },
    setProjectCode(event, timeEntry) {
      timeEntry.tempProjectCode = event.target.value;
    },
    setStoryRef(event, timeEntry) {
      timeEntry.tempStoryRef = event.target.value;
    },
    setNote(event, timeEntry) {
      timeEntry.tempNote = event.target.value;
    },
    syncButtonClicked() {
      if(!this.synced) {
        if(this.userGuid == "" || !this.userGuid) {
          // Create a new User Account
          this.createNewUserAccount();
        }
        else {
          // Sync with Account
          this.syncWithAccount();
        }
      }
      else {
        // Change Sync Account
        this.changeSyncAccount();
      }
    },
    timeFromDate(date) {
      if(date == undefined) return "";
      const hrs = date.getHours() < 10 ? "0" + date.getHours(): date.getHours() + "";
      const mins = date.getMinutes() < 10 ? "0" + date.getMinutes(): date.getMinutes() + "";
      return hrs + ":" + mins;
    },
    timeFromDateDisplay(date) {
      if(date == undefined) return "";
      var hrs = date.getHours();
      var mins = date.getMinutes();
      var hrsDisp = (hrs == 0 ? 12 : hrs <= 12 ? hrs : hrs - 12) + "";
      var minsDisp = mins < 10 ? "0" + mins: mins + "";
      const amPmDisp = hrs < 12 ? "AM" : "PM"
      return hrsDisp + ":" + minsDisp + " " + amPmDisp;
    },
    timeEntriesForDate(date) {
      var time = date.getTime();
      let list = this.timeEntryList
        .filter((x) => (
          time <= x.startTime &&
          time + 86400000 > x.startTime
        ));

      list.sort((x,y) => x.startTime < y.startTime ? -1 : 1);

      return list;
    },
    toggleEntered(timeEntry) {
      if(timeEntry.editing){
        timeEntry.tempEntered = !timeEntry.tempEntered
      }
      else {
        timeEntry.entered = !timeEntry.entered;
        if(this.synced) {
          this.updateTimeEntry(timeEntry);
        }
        else {
          localStorage[`${this.year}-${this.month}`] = JSON.stringify(this.timeEntryList);
        }
      }
    },
    weekSummariesForDate(date) {
      const weekEntries = this.timeEntryList
        .filter((x) => (
          date.getTime() - 518400000 <= x.startTime &&
          date.getTime() + 86400000 > x.startTime
        ));
      let summaries = [];
      let totalHours = 0;
      for(var i = 0; i < weekEntries.length; i++) {
        const entry = weekEntries[i];
        if(!entry.projectCode) continue;
        const id = `${entry.projectCode}`;
        let summary = summaries.find(summary => summary.id === id);
        let duration = entry.duration;
        totalHours += duration;
        if(summary === undefined) {
          summaries.push (
            { 
              id,
              projectCode: entry.projectCode,
              durationMin: duration
            }
          );
        }
        else {
          summary.durationMin += duration;
        }
      }
      summaries.push (
        { 
          id: 'Total',
          projectCode: 'Total',
          durationMin: totalHours
        }
      );
      return summaries;
    },
    summaryDateRange(dateStart, dateEnd) {
      const weekEntries = this.timeEntryList
        .filter((x) => (
          dateStart.getTime() <= x.startTime &&
          dateEnd.getTime() + 86400000 > x.startTime
        ));
        let summaries = [];
      let totalHours = 0;
      for(var i = 0; i < weekEntries.length; i++) {
        const entry = weekEntries[i];
        if(!entry.projectCode) continue;
        const id = `${entry.projectCode}`;
        let summary = summaries.find(summary => summary.id === id);
        let duration = entry.duration;
        totalHours += duration;
        if(summary === undefined) {
          summaries.push (
            { 
              id,
              projectCode: entry.projectCode,
              durationMin: duration
            }
          );
        }
        else {
          summary.durationMin += duration;
        }
      }
      summaries.push (
        { 
          id: 'Total',
          projectCode: 'Total',
          durationMin: totalHours
        }
      );
      return summaries;
    },
    displayHoursTime(timeinMinutes) {
      const minutes = timeinMinutes%60;
      return Math.floor(timeinMinutes/60) + ":" + (minutes < 10 ? '0'+minutes : minutes);
    },
    displayHoursDecimal(timeinMinutes) {
      return (timeinMinutes/60).toFixed(2);
    }
  },
  computed: {
    displayDayOfWeek() {
      const weekday = new Array(7);
      weekday[0] = "Sun";
      weekday[1] = "Mon";
      weekday[2] = "Tue";
      weekday[3] = "Wed";
      weekday[4] = "Thu";
      weekday[5] = "Fri";
      weekday[6] = "Sat";

      return weekday;
    },
    datesWithinMonth() {
      var dates = [];
      var date = new Date(this.year, this.month-1, 1);
      while(date.getMonth() === this.month-1)
      {
        dates.push(date);
        date = new Date(this.year, this.month-1, date.getDate() + 1);
      }
      return dates;
    },
    weeksWithinMonth() {
      var weeks = [];
      var week = {
        dates: []
      };
      var date = new Date(this.year, this.month-1, 1);
      while(date.getMonth() === this.month-1)
      {
        week.dates.push(date);
        if(date.getDay() === 6 || new Date(this.year, this.month-1, date.getDate() + 1).getMonth() === parseInt(this.month)) {
          //week.summary = this.weekSummariesForDate(date);
          week.lastDate = week.dates[week.dates.length-1];
          week.summary = this.summaryDateRange(week.dates[0], week.lastDate);
          weeks.push(week);
          week = {
            dates: []
          };
        }
        date = new Date(this.year, this.month-1, date.getDate() + 1);
      }
      return weeks;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
header {
  background-image: url('~@/assets/Flannel_Loose.png');
  z-index:1; 
  position: fixed; 
  height: 170px; 
  width:100%; 
  margin: 0; 
  box-shadow: 3px 3px 3px 3px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.9);
}
#timeentries {
  border-spacing: 0;
}
.timeEntry {
  height: 46px;
}
</style>
