import parseDate from 'date-fns/parse'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

export default {
	props: ['id'],
	data: function() {
		return {
			lastModified: "2017-01-17T09:29:54Z",
			identifier: "http://urn.fi/urn:nbn:fi:csc-kata20160308103219249760",
			title: "Helsinki Kumpula SMEAR III meteorology - Air temperature - 2002",
			description: "Title: Air temperature\n\nDescription: Air temperature, Physicum roof, (degC)\n\nVariable: t\n\nUnit: °C\n\nSource: saa\n\nCategory: Meteorology",
			keywords: ["ilma", "lämpötila"],
			newKeyword: '',
		}
	},
	methods: {
		addNewKeyword: function() {
			console.log("keywords-pre:", this.keywords, this);
			if (this.newKeyword.length > 0) {
				this.keywords.push(this.newKeyword)
				this.newKeyword = ''
			}
			console.log("keywords-post:", this.keywords, this);
		},
		formatRelDate: function(iso) {
			//Date.parse(iso);
			//return distanceInWordsToNow(parseDate(iso));
			var d = new Date(iso);
			// invalid date, NaN !== NaN; see http://stackoverflow.com/a/12372720
			if (d.getTime() !== d.getTime()) {
				return "on " + iso;
			}
			return distanceInWordsToNow(d) + " ago";
		},
	}
}
