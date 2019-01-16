export default {
	methods: {
		borderColor(depth) {
			const red = '#e6194B';
			const orange = '#f58231';
			const yellow = '#ffe119';
			const lime = '#bfef45';
			const green = '#3cb44b';
			const cyan = '#42d4f4';
			const blue = '#4363d8';
			const purple = '#911eb4';
			const magenta = '#f032e6';
			const mint = '#aaffc3';
			const teal = '#469990';

			switch(depth % 10) {
				case 1: return lime;
				case 2: return green;
				case 3: return cyan;
				case 4: return blue;
				case 5: return purple;
				case 6: return magenta;
				case 7: return mint;
				case 8: return teal;
				case 9: return yellow;
				case 10: return orange;
				default: return red;
			}

			// https://learnui.design/tools/data-color-picker.html
			//const colours = ['#007fad', '#007c97', '#01777f', '#297069', '#3d6857', '#49604b', '#505844', '#698135', '#7d9c1f', '#99bb00']
			//return colours[depth % 10]
		},
		listItemStyle(depth) {
			const width = 6; //11 - depth;
			return { 'border-left': `solid ${width}px ${this.borderColor(depth)} !important` }
		}
	}
}
