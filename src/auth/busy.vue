<template>
	<div>
		<figure style="width: 300px;">
			<div class="figure-content">
			<svg width="100%" height="100%" viewBox="0 0 42 42" class="donut" aria-labelledby="beers-title beers-desc" role="img">
				<title id="beers-title">Beers in My Cellar</title>
				<desc id="beers-desc">Donut chart showing 10 total beers. Two beers are Imperial India Pale Ales, four beers are Belgian Quadrupels, and three are Russian Imperial Stouts. The last remaining beer is unlabeled.</desc>
				<circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff" role="presentation"></circle>
				<circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" stroke-width="4" role="presentation"></circle>

				<circle id="completion" class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#377bbc" stroke-width="4" stroke-dasharray="98 2" stroke-dashoffset="25" aria-labelledby="donut-segment-1-title donut-segment-1-desc">
					<title id="donut-segment-1-title">percent complete</title>
					<desc id="donut-segment-1-desc">Chart showing completeness of metadata according to schema.</desc>
				</circle>

				<polygon points="0,0 4,6 6,4" transform="translate(30,30)" style="fill:lightblue;stroke:white;stroke-width:1;visibility:invisible;" />
				<polygon id="leg-of-q" points="0,0 6,10 10,6" transform="translate(28,28)" style="fill:#906; stroke:white;stroke-width:1" />
				<g class="chart-percentage" style="visibility: hidden;">
					<text x="50%" y="50%" class="chart-text-label">
					loading
					</text>
				</g>
				<g class="chart-logo" style="visibility: invisible;">
				<text x="50%" y="50%" class="chart-text-qvain">
				qvain
				</text>
				</g>
				<g class="chart-loading" style="visibility: visible;">
				<text x="50%" y="50%" class="chart-text-loading">
				loading
				</text>
				</g>
			</svg>
			</div>
		</figure>

		<i class="fas fa-circle-notch fa-spin fa-w-16"></i>
		<p>message: {{ message }}</p>
		<p>user:
			<dl v-if="$auth.loggedIn">
				<dt>loggedIn</dt><dd>{{ $auth.loggedIn }}</dd>
				<dt>id</dt><dd>{{ $auth.user.id }}</dd>
				<dt>name</dt><dd>{{ $auth.user.name }}</dd>
				<dt>email</dt><dd>{{ $auth.user.email }}</dd>
			</dl>
			<p v-else>not logged in (loggedIn: {{ $auth.loggedIn }})</p>
		</p>
	</div>
</template>

<script>
export default {
	name: "token-login",
	data: () => {
		return {}
	},
	computed: {
		message() {
			return this.$route.hash ? `logging in... hash: |${this.$route.hash}| token: ${this.token}` : "no token"
		},
		token() {
			return this.$route.hash.charAt(0) == '#' ? this.$route.hash.substr(1) : this.$route.hash
		},
	},
	created: function() {
		if (this.token) {
			this.$auth.login(this.token)
		}
	},
}	
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Montserrat:400);

body {
  font: 16px/1.4em "Montserrat", Arial, sans-serif;
}

* {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}

.chart-percentage,
.chart-logo,
.chart-loading {
  font: 16px/1.4em "Montserrat", Arial, sans-serif;
  fill: #000;
  -moz-transform: translateY(0.25em);
  -ms-transform: translateY(0.25em);
  -webkit-transform: translateY(0.25em);
  transform: translateY(0.25em);
}

.chart-text-number {
  font-size: 0.6em;
  line-height: 1;
  text-anchor: middle;
  -moz-transform: translateY(-0.25em);
  -ms-transform: translateY(-0.25em);
  -webkit-transform: translateY(-0.25em);
  transform: translateY(-0.25em);
}

.chart-text-qvain {
  fill: #023;
  font-size: 0.6em;
  line-height: 1;
  text-anchor: middle;
  transform: translateY(-0.10em); /* wiggle it; we have a descender but no ascender */
  alignment-baseline: baseline;
  /* auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | inherit */
}

.chart-text-loading {
  fill: #023;
  font-size: 0.4em;
  /* font-weight: bold; */
  line-height: 1;
  text-anchor: middle;
  transform: translateY(-0.20em);
  alignment-baseline: baseline;
}

.chart-text-label {
  font-size: 0.2em;
  text-transform: uppercase;
  text-anchor: middle;
  -moz-transform: translateY(0.7em);
  -ms-transform: translateY(0.7em);
  -webkit-transform: translateY(0.7em);
  transform: translateY(0.7em);
}

figure {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  margin-left: -15px;
  margin-right: -15px;
}

@media (min-width: 768px) {
  figure {
    flex-direction: row;
  }
}

.figure-content,
.figure-key {
  flex: 1;
  padding-left: 15px;
  padding-right: 15px;
  align-self: center;
}

.figure-content svg {
  height: auto;
}

.figure-key {
  min-width: calc(8 / 12);
}

.figure-key [class*="shape-"] {
  margin-right: 6px;
}

.figure-key-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.figure-key-list li {
  margin: 0 0 8px;
  padding: 0;
}

.shape-circle {
  display: inline-block;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  -webkit-border-radius: 50%;
     -moz-border-radius: 50%;
          border-radius: 50%;
}

.shape-fuschia {
  background-color: #ce4b99;
}

.shape-lemon-lime {
  background-color: #b1c94e;
}

.shape-blue {
  background-color: #377bbc;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

circle#completion {
	/*animation: fillup 2s linear 1; */
	/*animation: spin 2s ease-out 5; */
	transform-origin: 50% 50%;
	animation: spin 3s ease-in 1, spin 2s 3s linear 5;
}

@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

@keyframes fillup {
  /* to { stroke-dasharray: 60 100; } */
  /* from { stroke-dasharray: 0 100; stroke: #ff3; stroke-dashoffset: 50; } */
  from { stroke-dasharray: 0 100; stroke: #ff3; }
}

#leg-of-q {
	/* animation: q-appear 2s linear 1; */
	/* animation: from-origin 2s ease-in 1, no-stroke 2.4s linear 1; */
	/* animation: q-appear 2.6s linear 1; */
	transform-origin: 50% 50%;
	transform: translate(28px, 28px);
	transform: rotate(0deg);
	animation: somespin 3s linear 10;
}

@keyframes somespin {
	/* from { transform: translate(0px, 0px); transform: rotate(50deg); } */
	100% { transform: rotate(360deg); }
}

.chart-logo {
	/* animation: q-appear 2s linear 1; */
	/* animation: fade-in 2s ease-out 1; */
	/* animation: q-appear 2.2s linear 1; */
	visibility: hidden;
}

@keyframes q-appear {
	0% { visibility: hidden; }
	99% { visibility: hidden; }
	100% { visibility: visible; }
}

@keyframes fade-in {
	from { opacity: 0; }
}

@keyframes from-origin {
	from { transform: translate(20px, 20px); opacity: 0; }
	to { transform: translate(28px, 28px); }
}

@keyframes no-stroke {
	0% { stroke-opacity: 0; fill: #fff; }
	99% { stroke-opacity: 0; fill: #fff; }
	100% { stroke-opacity: 1; }
}

</style>
