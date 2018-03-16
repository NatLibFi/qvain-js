import userdb from './userdb.js'

var dummyRecords = [
	{ 'id': "002", 'creator': "069", 'owner': "069", 'ownertype': "uid", 'created': "2016-10-15T20:12:40+03:00", 'modified': "", 'title': "Dataset of Great Importance" },
	{ 'id': "005", 'creator': "069", 'owner': "069", 'ownertype': "uid", 'created': "2016-10-18T07:03:28+03:00", 'modified': "", 'title': "Sexlife of the Lesser Atlantic Water Hog" },
	{ 'id': "006", 'creator': "069", 'owner': "001", 'ownertype': "gid", 'created': "2016-10-19T00:20:52+03:00", 'modified': "", 'title': "Rural dishabituation of Great Monk Swans" },
	{ 'id': "013", 'creator': "069", 'owner': "002", 'ownertype': "gid", 'created': "2016-10-24T04:44:36+03:00", 'modified': "", 'title': "Swarmy Seal Sedation Statistics" },
	{ 'id': "026", 'creator': "069", 'owner': "002", 'ownertype': "gid", 'created': "2016-10-20T19:58:12+03:00", 'modified': "", 'title': "Great Puppet Percentage of Governments in the 20th Century" },
	{ 'id': "036", 'creator': "069", 'owner': "096", 'ownertype': "oid", 'created': "2016-10-19T19:42:12+03:00", 'modified': "", 'title': "Corporate Responsibility and the Shmoo" },
	{ 'id': "027", 'creator': "666", 'owner': "666", 'ownertype': "uid", 'created': "2016-10-21T11:13:24+03:00", 'modified': "", 'title': "Income distribution in relation to gender and age" },
];

var recorddb = {
	records: dummyRecords,
	getForUser: function(id) {
		return this.records.filter(this.recordHasOwner(id, "uid"))
	},
	getForGroup: function(id) {
		return this.records.filter(this.recordHasOwner(id, "gid"))
	},
	getAllForUser: function(id, wantGrp, wantOrg) {
		//console.log("group, org?", wantGrp, wantOrg);
		var myRecs = this.getForUser(id);
		
		if (wantGrp) {
			var myGroups = userdb.getGroupsFor(id).map(function(v) {return v.gid})
			var myGrpRecs = []
			//myGroups.forEach(function(grp) { console.log("grp:", grp, this.getForGroup(grp)); myGrpRecs.push.apply(myGrpRecs, this.getForGroup(grp)) }, this);
			myGroups.forEach(function(grp) {
				this.getForGroup(grp).forEach(function(rec) { myGrpRecs.push(rec) })
			}, this);
			//console.log("myGrpRecs:", myGrpRecs);
			myRecs = myRecs.concat(myGrpRecs);
		}
		
		if (wantOrg) {
		}
		
		return myRecs;
	},
	recordHasOwner: function(id, type) {
		return function(record) {
			//console.log("type:", type, "id:", id, "record:", record);
			return record.ownertype === type && record.owner === id
		}
	}
}

export default recorddb;
