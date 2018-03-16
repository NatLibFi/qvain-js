var dummyUsers = {
	'001': { 'uid': "001", 'name': "El Primer Usuario"},
	'069': { 'uid': "069", 'name': "Wouter Van Hemel" },
	'666': { 'uid': "666", 'name': "Saatana Perkele" },
}

var dummyGroups = [
{ 'gid': "001", 'name': "nasty project", 'members': ["069", "666"] },
{ 'gid': "002", 'name': "shitty project", 'members': ["001", "069", "666"] },
]

var userdb = {
	users: dummyUsers,
	groups: dummyGroups,
	getUser: function(user) {
		return users[user];
	},
	getGroupsFor: function(uid) {
		return this.groups.filter(this.groupHasMember(uid))
	},
	groupHasMember: function(uid) {
		return function(group) {
			return group.members.indexOf(uid) > -1
		}
	}
}

export default userdb;
