@echo off
cd ..
echo calling webpack...
call webpack --bail
IF %errorlevel% NEQ 0 (
    echo PACK FAILURE
    exit
) ELSE (
    echo GONNA GULP
    gulp upload
)
