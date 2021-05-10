// good practice as a reference point
let db = [
	screams: [
		{
			userHandle: 'user',
			body: 'this is the scream body',
			createdAt: "2021-05-10T17:47:32.943Z"
			likeCount: 5, // added these to prevent too many unnecessary reads since firebase charge more for each read
			commentCount: 2
		}
	]
]