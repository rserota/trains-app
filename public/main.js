let vm = new Vue({
	el: '#app',
	data: {
		trainLists: [], //  a list of ids for each train list (i.e. each CSV file that has been uploaded)
		trainRuns: [], // the particular list of train runs that we're looking at currently
		sortColumn: 'run_number',
        sortDirection: 1,
		currentPage: 1,
		perPage: 5,

	},
	created: async function(){
		console.log('hi')
		let trainLists = await fetch('/train-list').then((data)=>{ return data.json() })
		console.log('??', trainLists)
		this.trainLists = trainLists.data

	},
	methods: {
		uploadFile: async function(){
			let csvFile = document.getElementById("file-upload-input").files[0];
			let formData = new FormData();

			formData.append("train-list", csvFile);
			let response = await fetch('/train-list', {method: "POST", body: formData}).then((data)=>{ return data.json()  })
		},
		getRuns: async function(trainList){
			let trainRuns = await fetch(`/train-list/${trainList.id}`).then((data)=>{ return data.json() })
			this.trainRuns = trainRuns.data

		},
		setPage: function(n){
			
			this.currentPage += n
			if ( this.currentPage < 1 ) {
				this.currentPage = 1
			}
		},
		sortBy: function(col){
			this.currentPage = 1
            if ( this.sortColumn == col ) { this.sortDirection = -this.sortDirection }
            else {
                this.sortColumn = col
                this.sortDirection = 1
            }
        },
	},
	computed: {
		sortedRuns: function(){
			let col = this.sortColumn
			let dir = this.sortDirection
			return this.trainRuns.slice().sort(function(a,b){
				// default sort block
				if      ( a[col] >  b[col] ) { return dir  }
				else if ( a[col] <  b[col] ) { return -dir }
				else if ( a[col] == b[col] ) { return 0    }
			})
        },
		runsPage: function(){
            return this.sortedRuns.filter((item, i)=>{
                return (i >= (this.currentPage-1) * this.perPage) && (i < (this.currentPage) * this.perPage )
            })
        },
	}
})
