# csharp-exec-server
Express.js server using MVC structure which can run C# code

Can also be run in Docker.

This was made for the Wien West Akademie Diplomarbeit.

## Short Documentation
Call `/runcsharp` using method POST, supplying content of `application/json` including:
- `user`: This is used as the name of the temporarily created files
- `code`: The C# code to be run

If one of these are missing, then `400` is returned.

Before the code is run, it is sanitized.  
Currently, code is checked for blacklisted libraries, however this will change later (I still gotta figure out how to actually sanitize code)  
and if the code uses one of these, then an Error is thrown.

Processes are started using Node.js' `spawn`:  
https://nodejs.org/api/child_process.html

Code is written to a file `/tmp/${user}.cs`

Code is compiled using `mcs`, which creates an exe with the same name as the cs file.  
Then it is executed using `mono`.  
https://www.geeksforgeeks.org/how-to-compile-decompile-and-run-c-code-in-linux/  
https://www.mono-project.com/

The code has (by default) 5 seconds to finish running.  
If it takes longer, it is terminated and `timedOut` gets set to `true`.

The following information is returned:
- `command`: Is either `mcs` or `mono`
- `commandDescription`: Is either `compilation` or `execution`
- `output`: From the spawned process' `stdout`. Is the output of the code, or says how many errors and warnings there are.
- `error`: From the spawned process' `stderr`. Is information about the error, if the code ran into one.
- `exitCode`: The exit code
- `timedOut`: Whether the code timed out

and with a status of `200` if OK, `400` if an error ocurred, and `408` if timed out.

Created files are deleted afterwards.  
Also when an exe couldn't be compiled, the cs file still gets deleted afterwards.

## Wien West Akademie Information Repository Link
https://github.com/Oktalon-Szoradi/wien-west-akademie
