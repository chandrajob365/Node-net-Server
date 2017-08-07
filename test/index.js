const Server = require('../lib/server')
Server.start()

Server.addRoute('GET', '/', login)
Server.addRoute('POST', '/loginValidation', loginValidation)
Server.addRoute('GET', '/home', home)
Server.addRoute('POST', '/success', success)
Server.addRoute('GET', '/logout', logout)

function login (request, response) {
  let sessionData = Server.getSession(request)
  if (sessionData) {
    Server.redirect(request, response, '/home')
  } else {
    Server.sendHtml(request, response, `
    <HTML>
      <head> </head>
      <title> Test App </title>
      <body>
        <h2> Login Form : </h2> </br> </br>
        <form method="post" action="/loginValidation">
          UserName : <input type='text' name='userName' placeholder='Enter your userName' />
          </br> </br>
          Password : <input type='password' name='password' placeholder='Enter your password' />
          </br> </br>
          <input type="submit" value="Login" />
        </form>
      </body>
      </HTML>
      `)
  }
}

function loginValidation (request, response) {
  // Do some DB check for entered credentials
  Server.createSession(request, response, (SESSION, cookie) => {
    SESSION[cookie] = {userName: request.body.userName}
  })
  Server.redirect(request, response, '/home')
}

function home (request, response) {
  let sessionData = Server.getSession(request)
  if (!sessionData) {
    Server.redirect(request, response, '/')
  } else {
    Server.sendHtml(request, response, 'Welcome ' + sessionData.userName + ` <HTML>
      <head> </head>
      <title> Test </title>
      <body>
      <h2>Upload File</h2>
      <form method="post" enctype="multipart/form-data" action="/success">
        Who are you: <input type="text" name="username" /><br />
        What's your age: <input type="text" name="age" /><br />
        Choose file1 to upload:
        <input type="file" name="file1" /> </br> </br>
        Choose file2 to upload:
        <input type="file" name="file2" /> </br> </br>
        Choose file3 to upload:
        <input type="file" name="file3" /> </br> </br>
        Choose file4 to upload:
        <input type="file" name="file4" /> </br> </br>
        <input type="submit" value="SEND" /> </br>
      </form>
      </body>
      </HTML>`)
  }
}

function logout (request, response) {
  Server.deleteSession(request)
  Server.redirect(request, response, '/')
}

function success (request, response) {
  let sessionData = Server.getSession(request)
  if (!sessionData) {
    Server.redirect(request, response, '/')
  } else {
    Server.sendHtml(request, response, 'Name = ' + request.body.username + '  Age = ' + request.body.age + ' Name from Session = ' + sessionData.userName + `
    <HTML>
     <head> </head>
     <title> Test </title>
     <body>
       </br> </br> <input type="button" onclick="logout()" value="Logout"/>
     </body>
     <script>
       function logout() {
         window.location.replace('/logout')
       }
     </script>
     </HTML>
    `)
  }
}
