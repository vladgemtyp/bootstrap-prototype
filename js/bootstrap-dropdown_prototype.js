/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */
/*

Modified for use with PrototypeJS

http://github.com/jwestbrook/bootstrap-prototype


*/



	"use strict"; // jshint ;_;

if(BootStrap === undefined)
{
	var BootStrap = {};
}


 /* DROPDOWN CLASS DEFINITION
	* ========================= */
var toggle = '[data-toggle=dropdown]';
BootStrap.Dropdown = Class.create({
	initialize : function (element) {
		element.store('bootstrap:dropdown',this)
		var $el = $(element).on('click',this.toggle)
		$$('html')[0].on('click', function () {
		$el.up().removeClassName('open')
		})
	}
	,toggle: function (e) {
		var $this = $(this)
		, $parent
		, isActive

		if ($this.hasClassName('disabled') || $this.readAttribute('disabled') == 'disabled') return

		$parent = getParent($this)

		isActive = $parent.hasClassName('open')

		clearMenus()

		if (!isActive) {
			if ('ontouchstart' in document.documentElement) {
				// if mobile we we use a backdrop because click events don't delegate
				var backdrop = new Element('div',{'class':'dropdown-backdrop'});
				backdrop.observe('click',clearMenus);
				$this.insert({'before':backdrop})
			}

			$parent.toggleClassName('open')
		}

		$this.focus()

		e.stop()
	}
	, keydown: function (e) {
		var $this
		, $items
		, $active
		, $parent
		, isActive
		, index

		if (!/(38|40|27)/.test(e.keyCode)) return

		$this = $(this)

		e.preventDefault()
		e.stopPropagation()

		if ($this.hasClassName('disabled') || $this.readAttribute('disabled') == 'disabled') return

		$parent = getParent($this)

		isActive = $parent.hasClassName('open')

		if (!isActive || (isActive && e.keyCode == Event.KEY_ESC))
		{
			if (e.which == Event.KEY_ESC) $parent.select(toggle)[0].focus()
			return $this.click()
		}

		// :visible is a jQuery extension - NOT VALID CSS
		//      $items = $parent.select('[role=menu] li:not(.divider):visible a')
		//
		$items = $parent.select('[role=menu] li:not(.divider) a')

		if (!$items.length) return

		index = -1
		$items.each(function(item,i){
		item.match(':focus') ? index = i : ''
		})

		if (e.keyCode == Event.KEY_UP && index > 0) index--                                        // up
		if (e.keyCode == Event.KEY_DOWN && index < $items.length - 1) index++                        // down
		if (!~index) index = 0

		$items[index].focus()
	}

});

function clearMenus() {
	$$('.dropdown-backdrop').invoke('remove')
	$$(toggle).each(function(i) {
	getParent(i).removeClassName('open')
	})
}

function getParent($this) {
	var selector = $this.readAttribute('data-target')
	, $parent

	if (!selector) {
		selector = $this.readAttribute('href')
		selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') && selector != '#' //strip for ie7
	}

	$parent = selector && $$(selector)

	if (!$parent || !$parent.length) $parent = $this.up()

	return $parent
}


	/* APPLY TO STANDARD DROPDOWN ELEMENTS
	 * =================================== */
document.observe("dom:loaded",function(){
	document.observe('click',clearMenus)
	$$('.dropdown form').invoke('observe','click',function(e){
		e.stop();
	});
	$$(toggle).invoke('observe','click',BootStrap.Dropdown.prototype.toggle)
	$$(toggle+', [role=menu]').invoke('observe','keydown',BootStrap.Dropdown.prototype.keydown)
});