#!/bin/bash

short_system=$(uname -s)
sys_vagrant="0"
sys_cygwin="0"
sys_osx="0"

mongo_missing="0"
node_missing="0"
heroku_missing="0"
npm_missing="0"

# set this to the number of the current lab
cur_lab=4

system=$(uname -a)
if [ "$system" == "Linux precise32 3.2.0-23-generic-pae #36-Ubuntu SMP Tue Apr 10 22:19:09 UTC 2012 i686 i686 i386 GNU/Linux" ]
then
  sys_vagrant="1"  
  echo "Running on Vagrant guest"
  
  user=$(whoami)
  
  if [ "$user" != "root" ]
  then
	echo "ERROR: You must run this script with sudo"
	exit
  fi
  
elif [ $short_system == "Darwin"  ]
then
  sys_osx="1"
  echo "Running on Mac OSX"
else
  sys_cygwin="1"
  echo "Running on Windows"
fi

if [ "$sys_vagrant" == "1" ]
then
# on vagrant guest

  required_pkg=( "mongo" "heroku" "node" "npm")

  all_present="1"

  for i in ${required_pkg[@]}
  do
    binloc="$(which $i)"
    if [ "${#binloc}" == "0" ]
    then
      echo "You don't have $i"
      all_present="0"
	  if [ "$i" == "mongo" ]
	  then
		mongo_missing="1"
	  elif [ "$i" == "heroku" ]
	  then
		heroku_missing="1"
	  elif [ "$i" == "node" ]
	  then
		node_missing="1"
	  elif [ "$i" == "npm" ]
	  then
		npm_missing="1"
	  fi
    fi
  done
  
  if [ "$mongo_missing" == "1" ]
  then
	echo "Installing MongoDB..."
	mongo_res=$(
	mkdir -p /data/db;
	chown vagrant /data/db;
	apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10;
	echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list;
	apt-get update;
	apt-get install -y mongodb-10gen;)
	
	mongo_loc=$(which mongo)
	if [ "${#mongo_loc}" == "0" ]
	then
		echo "Auto install failed."
	else
		echo "Auto install succeeded"
	fi
  fi
  
  if [ "$heroku_missing" == "1" ]
  then
	heroku_res=$(echo "Installing Heroku Toolbelt...";
	wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh)
	heroku_loc=$(which heroku)
	if [ "${#heroku_loc}" == "0" ]
	then
		echo "Auto install failed."
	else
		echo "Auto install succeeded"
	fi
  fi
  
  if [ "$node_missing" == "1" ]
  then
    echo "Installing nodejs"    
	node_res=$(apt-get -y install nodejs)
	node_loc=$(which node)
	if [ "${#node_loc}" == "0" ]
	then
		echo "Auto install failed."
	else
		echo "Auto install succeeded"
	fi
  fi
  
  if [ "$npm_missing" == "1" ]
  then
    echo "Installing npm"  
	npm_res=$(apt-get -y install npm)
	npm_loc=$(which npm)
	if [ "${#npm_loc}" == "0" ]
	then
		echo "Auto install failed."
	else
		echo "Auto install succeeded"
	fi
  fi

  # current lab hardcoded
  node_status=$(cd lab4;npm ls 2>&1)

  if [[ $node_status == *"UNMET DEPENDENCY"* ]]
  then
    echo "FAIL: Node is missing packages"
    echo "Attempting to repair."
    install_status=$(cd lab4; npm -y install --no-bin-links)

    node_status=$(cd lab4;npm ls 2>&1)
  
    if [[ $node_status != *"UNMET DEPENDENCY"* ]]
    then
      echo "PASS: Repair successful. All node packages installed."
    fi
  fi

  if [ $all_present == "1" ]
  then
    echo "PASS: Vagrant is correctly set up."
  fi


else

  if [ "$sys_osx" == "1" ]
  then
  #on osx host system
    dirloc="$(pwd)"

    IFS=/ read -a dirarr <<< "$dirloc"
    if [ "${dirarr[4]}" != "introHCI" ]
    then
      echo "FAIL: Either you are not running this script in the introHCI directory or your directory is named incorrectly."
    else
      echo "PASS: introHCI directory named and positioned correctly"
    fi

  elif [ "$sys_cygwin" == "1"  ]
  then
    dirloc="$(pwd)"

    IFS=/ read -a dirarr <<< "$dirloc"
    if [ "${dirarr[5]}" != "introHCI" ]
    then
      echo "FAIL: Either you are not running this script in the introHCI directory or your directory is named incorrectly."
    else
      echo "PASS: introHCI directory named and positioned correctly"
    fi
  fi

  
  vagrant_check=$(grep MSB Vagrantfile | wc -l | xargs)

  if [ $vagrant_check == "4" ]
  then
    echo "PASS: You are using the correct Vagrantfile"
  else
    echo "FAIL: CS147 Vagrantfile not found. Are you running this in the introHCI directory?"
  fi

  missing_dirs="0"
  hcidirs=$(ls)

  # current lab hardcoded
  for i in {1..4} 
  do
    target_dir="lab$i"
  if [[ $hcidirs == *"$target_dir"* ]]
    then
      echo "Found $target_dir"
    else
      echo "ERROR: Cannot find $target_dir"
      missing_dirs="1"
    fi
  done

  if [ $missing_dirs == "1" ]
  then
    echo "FAIL: Your introHCI directory is missing the above lab folders."
  else
    echo "PASS: All required lab directories present."
  fi

fi
