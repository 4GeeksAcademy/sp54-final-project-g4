const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [{title: "FIRST", background: "white", initial: "white"},
             {title: "SECOND", background: "white", initial: "white"}],
      isLogin: false,
			showModalSignup: false,
			showModalSignin: false
    },
    actions: {
      signin: async (data) => {
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				}
				const response = await getActions().APICall(process.env.BACKEND_URL + '/api/signin/', options);
				if (response.access_token != undefined) {
					getActions().signedIn()
					localStorage.setItem('access_token', response.access_token)
				} else console.error('Algo salio mal, no se el que, pero algo', response)
			},

			signup: async (data) => {
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				}
				return await getActions().APICall(process.env.BACKEND_URL + '/api/signup/', options)
			},

			getProfileUser: async (user) => {
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					}
				}
				const response = await getActions().APICall(process.env.BACKEND_URL + '/api/profile/' + user, options)
				return response.results
			},

			getUserLoggedIn: async () => {
				if (localStorage.getItem('access_token')){
					const options = {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
						}
					}
					const response = await getActions().APICall(process.env.BACKEND_URL + '/api/profile/check', options)
					return response.results
				} else return 'None'
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
      // Use getActions to call a function within a fuction
      exampleFunction: () => { getActions().changeColor(0, "green"); },
      getMessage: async () => {
        try {
          // Fetching data from the backend
          const url = process.env.BACKEND_URL + "/api/hello";
          const options = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
          const response = await fetch(url, options)
          const data = await response.json()
          setStore({ message: data.message })
          return data;  // Don't forget to return something, that is how the async resolves
        } catch (error) {
          console.log("Error loading message from backend", error)
        }
      },
      changeColor: (index, color) => {
        const store = getStore();  // Get the store
        // We have to loop the entire demo array to look for the respective index and change its color
        const demo = store.demo.map((element, i) => {
          if (i === index) element.background = color;
          return element;
        });
        setStore({ demo: demo });  // Reset the global store
      }
    }
  };
};

export default getState;
