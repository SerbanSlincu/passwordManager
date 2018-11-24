#!/usr/bin/python

from setuptools import setup, find_packages
import subprocess

setup(name='heisenberg',
      version='1.0',
      description='Password manager with an easy to use master password',
      author='Los hermanos informaticos',
      author_email='serbanslincu@gmail.com', 
      install_requires = ['dataset', 'pyperclip'],
     )
print subprocess.check_output(['sudo apt install xclip'])
print subprocess.check_output(['sudo mv heisenberg.py /usr/bin'])
