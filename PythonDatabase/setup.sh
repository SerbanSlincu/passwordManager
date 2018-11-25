#!/bin/bash

# Install the modules for python
pip install dataset
pip install pyperclip

# Install the software needed for copying to the clipboard
sudo apt install xclip

# Make it a command
sudo mv heisenberg /usr/bin
