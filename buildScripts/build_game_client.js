({
    baseUrl: '../src/js',
    mainConfigFile: '../src/js/app/main.js',
    name: 'app/main',
    out: '../src/js/compiled/compiled.js',
    preserveLicenseComments: false,
    generateSourceMaps: false,
    optimize: 'uglify2',
    paths: {
	    requireLib: 'libs/require',
	    json2:'libs/json2',
	    stats:'libs/stats',
	    leap:'libs/leap'
    },
	shim: {
		json2: {
			exports: 'JSON'
		},
		stats: {
			exports: 'Stats'
		},
		leap: {
			exports: 'Leap'
		}
	},
    include: 'requireLib'
})