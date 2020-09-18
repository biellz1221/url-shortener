const app = new Vue({
	el: '#app',
	data() {
		return {
			url: '',
			slug: '',
			error: '',
			created: null,
			formVisible: true,
		};
	},
	methods: {
		async shorten() {
			this.error = '';
			const response = await fetch('/url', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					url: this.url,
					slug: this.slug || undefined,
				}),
			});
			if (response.ok) {
				const result = await response.json();
				this.formVisible = false;
				this.created = window.location.href + result.slug;
			} else {
				const result = await response.json();
				this.error = result.message;
				alert(this.error);
			}
		},
	},
});

//admin
//CavaloFesteiro2020,
