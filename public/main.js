let vm = new Vue({
	el: '#app',
	methods: {
		uploadFile: async ()=>{
			console.log('hi')
			let csvFile = document.getElementById("file-upload-input").files[0];
			let formData = new FormData();

			formData.append("train-list", csvFile);
			let response = await fetch('/train-list', {method: "POST", body: formData});
			let responseObj = await response.json()
		}
	}
})
