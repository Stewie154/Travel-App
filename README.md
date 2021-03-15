# Travel App
 Final project from Udacity front end course

 Initially I had a problem with the synchronicity of this project. My api calls were retrieving the data I wanted, but not in the correct order. This lead to trying to update UI elements with data that hadn't been retrieved yet.

 I solved this problem by putting each api call into it's own function, then creating the handleSubmit async function, which waits for each api call function to run before moving onto the next one. This also helped the code become more readable.   
