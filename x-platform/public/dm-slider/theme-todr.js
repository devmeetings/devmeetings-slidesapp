/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

ace.define('ace/theme/todr', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-todr";
exports.cssText = ".ace-todr .ace_gutter {\
background: #0f0f0f;\
color: #bebebe\
}\
.ace-todr .ace_type {\
color: #F2F257;\
}\
.ace-todr .ace_print-margin {\
width: 1px;\
background: #1a1a1a\
}\
.ace-todr {\
background-color: #0F0F0F;\
color: #FFFFFF\
}\
.ace-todr .ace_cursor {\
color: #FFFFFF\
}\
.ace-todr .ace_marker-layer .ace_selection {\
background: #16589B\
}\
.ace-todr.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #0F0F0F;\
border-radius: 2px\
}\
.ace-todr .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-todr .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #404040\
}\
.ace-todr .ace_marker-layer .ace_active-line {\
background: #333333\
}\
.ace-todr .ace_gutter-active-line {\
background-color: #333333\
}\
.ace-todr .ace_marker-layer .ace_selected-word {\
border: 1px solid #16589B\
}\
.ace-todr .ace_invisible {\
color: #404040\
}\
.ace-todr .ace_keyword,\
.ace-todr .ace_meta {\
color: #FF6600\
}\
.ace-todr .ace_constant,\
.ace-todr .ace_constant.ace_character,\
.ace-todr .ace_constant.ace_character.ace_escape,\
.ace-todr .ace_constant.ace_other {\
color: #339999\
}\
.ace-todr .ace_constant.ace_numeric {\
color: #99CC99\
}\
.ace-todr .ace_invalid,\
.ace-todr .ace_invalid.ace_deprecated {\
color: #CCFF33;\
background-color: #000000\
}\
.ace-todr .ace_fold {\
background-color: #FFCC00;\
border-color: #FFFFFF\
}\
.ace-todr .ace_entity.ace_name.ace_function,\
.ace-todr .ace_support.ace_function,\
.ace-todr .ace_variable {\
color: #FFCC00\
}\
.ace-todr .ace_variable.ace_parameter {\
font-style: italic\
}\
.ace-todr .ace_string {\
color: #66FF00\
}\
.ace-todr .ace_string.ace_regexp {\
color: #44B4CC\
}\
.ace-todr .ace_comment {\
color: #D582FF\
}\
.ace-todr .ace_entity.ace_other.ace_attribute-name {\
font-style: italic;\
color: #C147FF\
}\
.ace-todr .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYNDTc/oPAALPAZ7hxlbYAAAAAElFTkSuQmCC) right repeat-y;\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
