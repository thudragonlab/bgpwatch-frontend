install:
	npm install

init_submodule:
	git submodule init

update_submodule:
	bash update_submodule.sh

update:
	git submodule update --init --recursive