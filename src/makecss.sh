#!/bin/bash
lessc main.less css/jerboa.css
juicer merge css/jerboa.css -o css/jerboa-embed.css --embed-images data_uri --force
juicer merge css/jerboa.css -o css/jerboa-normal.css --force
