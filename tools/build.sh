#!/bin/sh
# ABGE BUILD SCRIPT

BUILDDIR=../build
SOURCEDIR=../src
OUTPUT=../lib/abge.js
OUTPUT_MINIFIED=../lib/abge.min.js
LICENSE=../LICENSE
NSBEGIN=${BUILDDIR}/BEGIN.js
NSEND=${BUILDDIR}/END.js
COMPRESSOR=yuicompressor-2.4.8.jar

# clear out the contents of the output files
> ${OUTPUT}
> ${OUTPUT_MINIFIED}

# start file with license info
cat ${LICENSE} >> ${OUTPUT}

# all of abge sits within the abge module
cat ${NSBEGIN} >> ${OUTPUT}

# drop in each sub module
cat ${SOURCEDIR}/anim.js >> ${OUTPUT}
cat ${SOURCEDIR}/component.js >> ${OUTPUT}
cat ${SOURCEDIR}/core.js >> ${OUTPUT}
cat ${SOURCEDIR}/entity.js >> ${OUTPUT}
cat ${SOURCEDIR}/event.js >> ${OUTPUT}
cat ${SOURCEDIR}/input.js >> ${OUTPUT}
cat ${SOURCEDIR}/layer.js >> ${OUTPUT}
cat ${SOURCEDIR}/scene.js >> ${OUTPUT}
cat ${SOURCEDIR}/sprite.js >> ${OUTPUT}
cat ${SOURCEDIR}/timer.js >> ${OUTPUT}

# close off the abge module
cat ${NSEND} >> ${OUTPUT}

# minify the output for release distribution
java -jar ${COMPRESSOR} ${OUTPUT} -v -o ${OUTPUT_MINIFIED}
