<?php
require "functions.php"; 

checkCookie();

if(isAuthorizedUser()) echo 'success';