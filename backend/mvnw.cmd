@ECHO OFF
SET MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6-bin\apache-maven-3.9.6
IF NOT EXIST "%MAVEN_HOME%\bin\mvn.cmd" (
  powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip' -OutFile '%TEMP%\maven.zip'"
  powershell -Command "Expand-Archive '%TEMP%\maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6-bin\' -Force"
)
"%MAVEN_HOME%\bin\mvn.cmd" %*
