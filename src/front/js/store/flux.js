import { jwtDecode } from 'jwt-decode';

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			baseURL: process.env.BACKEND_URL,
			message: null,
			demo: [{ title: "FIRST", background: "white", initial: "white" },
			{ title: "SECOND", background: "white", initial: "white" }],
			isLogin: false,
			showModalSignup: false,
			showModalSignin: false,
			userInfo: null,
		},

		actions: {

			// API Handler
			APICall: async (url, options) => {
				try {
					const response = await fetch(getStore().baseURL + url, options);
					if (!response.ok) {
						console.error('Error: ' + response.status, response.statusText);
						return response;
					}
					return await response.json();
				} catch (error) {
					console.error('Error in fetch:', error);
					return null;
				}
			},

			optionsMethod: async (method, data = null) => {
				const headers = { 'Content-Type': 'application/json' }
				if (localStorage.getItem('access_token')) { headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`; }
				const options = {
					method: method,
					headers: headers,
				}
				if (data) {
					options.body = JSON.stringify(data);
				}
				return options;
			},

			login: async (data) => {
				const response = await getActions().APICall('login/', await getActions().optionsMethod('POST', data));
				if (typeof response == 'object') {
					localStorage.setItem('access_token', response.access_token)
					getActions().signedIn()
					return response.message
				}
				return null
			},

			checkPassword: async (data) => {
				return await getActions().APICall('check-password/', await getActions().optionsMethod('POST', data))
			},

			signup: async (data) => {
				const response = await getActions().APICall('signup/', await getActions().optionsMethod('POST', data));
				if (typeof response == 'object') {
					return response.message
				}
				return null
			},

			getUserList: async () => {
				return await getActions().APICall('users/', await getActions().optionsMethod('GET'))
			},

			getUser: async (user) => {
				return await getActions().APICall(`users/${user}`, await getActions().optionsMethod('GET'))
			},

			getUserId: async (id) => {
				return await getActions().APICall(`users/id/${id}`, await getActions().optionsMethod('GET'))
			},

			editUser: async (user, data) => {
				return await getActions().APICall(`users/${user}`, await getActions().optionsMethod('PUT', data))
			},

			getMovies: async () => {
				return await getActions().APICall('movies/', await getActions().optionsMethod('GET'))
			},

			addMovie: async (data) => {
				return await getActions().APICall('movies/', await getActions().optionsMethod('POST', data));
			},

			getMovie: async (movie_id) => {
				return await getActions().APICall(`movies/${movie_id}`, await getActions().optionsMethod('GET'))
			},

			editMovie: async (movie_id, data) => {
				return await getActions().APICall(`movies/${movie_id}`, await getActions().optionsMethod('PUT', data))
			},

			addTagToMovie: async (movie_id, tag_id) => {
				return await getActions().APICall(`movies/${movie_id}/managetags/${tag_id}`, await getActions().optionsMethod('POST'))
			},

			removeTagFromMovie: async (movie_id, tag_id) => {
				return await getActions().APICall(`movies/${movie_id}/managetags/${tag_id}`, await getActions().optionsMethod('DELETE'))
			},

			editTag: async (tag_id, data) => {
				return await getActions().APICall(`tags/${tag_id}`, await getActions().optionsMethod('PUT', data))
			},

			getReview: async (movie_id, user_id) => {
				return await getActions().APICall(`reviews/${movie_id}/${user_id}`)
			},

			postReview: async (movie_id, user_id, data) => {
				return await getActions().APICall(`reviews/${movie_id}/${user_id}`, await getActions().optionsMethod('POST', data));
			},

			editReview: async (movie_id, user_id, data) => {
				return await getActions().APICall(`reviews/${movie_id}/${user_id}`, await getActions().optionsMethod('PUT', data));
			},

			getPlaylist: async (user_id) => {
				return await getActions().APICall(`playlists/${user_id}`)
			},

			createPlaylist: async (user_id, data) => {
				return await getActions().APICall(`playlists/${user_id}`, await getActions().optionsMethod('POST', data));
			},

			deletePlaylist: async (user_id, data) => {
				return await getActions().APICall(`playlists/${user_id}`, await getActions().optionsMethod('DELETE', data));
			},

			editPlaylist: async (user_id, data) => {
				return await getActions().APICall(`playlists/${user_id}`, await getActions().optionsMethod('PUT', data));
			},

			addMovieToPlaylist: async (playlist_id, movie_id) => {
				return await getActions().APICall(`playlists/${playlist_id}/managemovies/${movie_id}`, await getActions().optionsMethod('POST'));
			},

			removeMovieFromPlaylist: async (playlist_id, movie_id) => {
				return await getActions().APICall(`playlists/${playlist_id}/managemovies/${movie_id}`, await getActions().optionsMethod('DELETE'));
			},

			getNotifications: async (user_id) => {
				return await getActions().APICall(`notifications/${user_id}`)
			},

			postNotification: async (user_id, data) => {
				return await getActions().APICall(`notifications/${user_id}`, await getActions().optionsMethod('POST', data));
			},

			deleteNotification: async (user_id, notification_id) => {
				return await getActions().APICall(`notifications/${user_id}/${notification_id}`, await getActions().optionsMethod('DELETE'));
			},

			followUser: async (follower_id, following_id) => {
				return await getActions().APICall(`managefollows/${follower_id}/${following_id}`, await getActions().optionsMethod('POST'));
			},

			unfollowUser: async (follower_id, following_id) => {
				return await getActions().APICall(`managefollows/${follower_id}/${following_id}`, await getActions().optionsMethod('DELETE'));
			},

			setSetting: async (user_id, setting_name, data) => {
				return await getActions().APICall(`settings/${user_id}/${setting_name}`, await getActions().optionsMethod('POST', data));
			},

			editSetting: async (user_id, setting_name, data) => {
				return await getActions().APICall(`settings/${user_id}/${setting_name}`, await getActions().optionsMethod('PUT', data));
			},

			deleteSetting: async (user_id, setting_name) => {
				return await getActions().APICall(`settings/${user_id}/${setting_name}`, await getActions().optionsMethod('DELETE'));
			},

			getReports: async () => {
				return await getActions().APICall(`reports/`)
			},

			getReport: async (user_id) => {
				return await getActions().APICall(`reports/${user_id}`)
			},

			postReport: async (user_id, data) => {
				return await getActions().APICall(`reports/${user_id}`, await getActions().optionsMethod('POST', data));
			},

			resolveReport: async (report_id, data) => {
				return await getActions().APICall(`reports/${report_id}`, await getActions().optionsMethod('PUT', data))
			},

			getUserLoggedIn: async () => {
				const response = await getActions().APICall(`check-current-user/`, await getActions().optionsMethod('GET'))
				setStore({ userInfo: response })
				return response
			},

			// Functions for the website
			checkTokenExpiration: (token) => {
				const decodedToken = jwtDecode(token);
				const expirationDate = decodedToken.exp * 1000;
				const currentTimestamp = Date.now();
				return expirationDate > currentTimestamp;
			},

			signedIn: () => {
				setStore({ isLogin: true });
			},

			signedOut: () => {
				localStorage.removeItem('access_token')
				setStore({ isLogin: false });
			},

			showModalSignin: (value) => {
				setStore({ showModalSignin: value });
			},

			showModalSignup: (value) => {
				setStore({ showModalSignup: value });
			},
		}
	};
};

export default getState;
