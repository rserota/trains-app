let vm = new Vue({
	el: '#app',
	data: {
		trainLists: [], //  a list of ids for each train list (i.e. each CSV file that has been uploaded)
		trainListId: null, // the Id of the current train list
		trainRuns: [], // the particular list of train runs that we're looking at currently
		newRun: {},
		sortColumn: 'run_number',
        sortDirection: 1, // ascending or descending
		currentPage: 1,
		perPage: 5,

	},
	created: async function(){
		this.getTrainLists() // get data from the server when the page loads
	},
	methods: {
		getTrainLists: async function(){
			let trainLists = await fetch('/train-list').then((data)=>{ return data.json() })
			this.trainLists = trainLists.data
		},
		uploadFile: async function(){
			let csvFile = document.getElementById("file-upload-input").files[0];
			let formData = new FormData();
			formData.append("train-list", csvFile);
			let response = await fetch('/train-list', {method: "POST", body: formData}).then((data)=>{ return data.json()  })
			await this.getTrainLists()
			await this.getRuns({id:response.trainListId})
		},
		getRuns: async function(trainList){
			let trainRuns = await fetch(`/train-list/${trainList.id}`).then((data)=>{ return data.json() })
			this.trainRuns = trainRuns.data
			this.trainListId = trainList.id
		},
		createRun: async function(){
			this.newRun.train_list_id = this.trainListId
			let response = await fetch('/runs', {
				method:"POST",
				body: JSON.stringify(this.newRun),
				headers: { 'Content-Type': 'application/json' }
			})
			await this.getRuns({id:this.trainListId})
		},
		deleteRun: async function(run){
			if ( confirm(`Are you sure you want to delete run ${run.run_number}?`) ) {
				let response = await fetch(`/runs/${run.id}`, {method: "DELETE"})
			}
			this.getRuns({id: run.train_list_id})
		},
		setPage: function(n){
			this.currentPage += n
			if ( this.currentPage < 1 ) {
				this.currentPage = 1
			}
			if ( this.runsPage.length === 0 ) {
				this.currentPage--
			}
		},
		sortBy: function(col){
			// sort by a different column, or flip the sort order if the user clicks the current column again
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
				if      ( a[col] >  b[col] ) { return dir  }
				else if ( a[col] <  b[col] ) { return -dir }
				else if ( a[col] == b[col] ) { return 0    }
			})
        },
		runsPage: function(){
			// filter items for pagination, based on the current page and number of items per page
            return this.sortedRuns.filter((item, i)=>{
                return (i >= (this.currentPage-1) * this.perPage) && (i < (this.currentPage) * this.perPage )
            })
        },
	}
})
