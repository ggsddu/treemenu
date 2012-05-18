/*
 * @author ggsddu
 * @url http://ggsddu.org/js-treemenu/
 * @email ggsddu.org@gmail.com
 */
function loadMenu(menuid, menupage, exp) {
	var httpRequest = createHttpRequest();

	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState == 4) {
			var menuXml = httpRequest.responseXML.documentElement;

			document.getElementById(menuid).appendChild(tree(menuXml, exp));
		}
	};
	httpRequest.open("GET", menupage + "?time=" + (new Date().getTime()), true);
	httpRequest.send(null);
}

var resource = {
	folder_open:    "images/folder_open.gif",
	folder_close:   "images/folder_close.gif",
	leaf:           "images/file.gif",
	line1:          "images/line_1.gif",
	line2:          "images/line_2.gif",
	line3:          "images/line_3.gif",
	minus1:         "images/minus_1.gif",
	minus2:         "images/minus_2.gif",
	plus1:          "images/plus_1.gif",
	plus2:          "images/plus_2.gif"
}

var nodeIndex = 0;
function tree(rootNode, ex) {
	var itemNodeList = fix(rootNode.childNodes);

	if (itemNodeList.length > 0) {
		var menuTable = document.createElement("table");
		menuTable.border = 0;
		menuTable.cellPadding = 0;
		menuTable.cellSpacing = 0;
		for (var i = 0; i < itemNodeList.length; i++) {
			var itemNode = itemNodeList[i];
			var itemId = nodeIndex++;
			var isLast = (itemNodeList.length - 1 == i);           //是否末节点
			var existChild = fix(itemNode.childNodes).length > 0;     //是否有子节点

			var toggleHref = "javascript:toggleMenu('menu" + itemId + "','branch" + itemId + "','leaf" + itemId + "'," + isLast + ")";

			var menuTr = menuTable.insertRow(-1);
			var menuTd_1 = menuTr.insertCell(-1);
			var menuTd_2 = menuTr.insertCell(-1);

			//生成树枝
			var branchIcon = document.createElement("img");
			if (existChild) {
				branchIcon.id = "branch" + itemId;
				if (ex) {
					branchIcon.src = isLast ? resource.minus2 : resource.minus1;
				} else {
					branchIcon.src = isLast ? resource.plus2 : resource.plus1;
				}


				var expand = document.createElement("a");
				expand.href = toggleHref;
				expand.appendChild(branchIcon);

				menuTd_1.appendChild(expand);
			} else {
				branchIcon.src = isLast ? resource.line3 : resource.line1;

				menuTd_1.appendChild(branchIcon);
			}

			//生成树页
			var leafIcon = document.createElement("img");
			leafIcon.align = "absmiddle";
			leafIcon.id = "leaf" + itemId;
			if (existChild) {
				if (ex) {
					leafIcon.src = resource.folder_open;
				} else {
					leafIcon.src = resource.folder_close;
				}

			} else {
				leafIcon.src = itemNode.getAttribute("image") ? itemNode.getAttribute("image") : resource.leaf;
			}

			var link = document.createElement("a");
			link.href = itemNode.getAttribute("href") ? itemNode.getAttribute("href") :
			(existChild ? toggleHref : "javascript:;");
			link.target = itemNode.getAttribute("target") ? itemNode.getAttribute("target") : "_self";
			link.appendChild(document.createTextNode(itemNode.getAttribute("label")));

			menuTd_2.appendChild(leafIcon);
			menuTd_2.appendChild(link);

			//生成子树
			if (existChild) {
				//有子菜单的情况
				var subMenuTr = menuTable.insertRow(-1);
				subMenuTr.id = "menu" + itemId;
				if (ex) {
					subMenuTr.style.display = "";
				} else {
					subMenuTr.style.display = "none";
				}
				var subMenuTd_1 = subMenuTr.insertCell(-1);
				var subMenuTd_2 = subMenuTr.insertCell(-1);

				if (!isLast) {
					subMenuTd_1.style.backgroundImage = "url(" + resource.line2 + ")";
				}

				subMenuTd_2.appendChild(tree(itemNode));
			}
		}
		return menuTable;
	} else {
		return null;
	}
}

//fix difference of ie and firefox
function fix(nodeList) {
	var result = new Array();
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].nodeType == 1) {
			result.push(nodeList[i]);
		}
	}
	return result;
}

//开关子菜单，并且替换图标
function toggleMenu(menuid, branchid, leafid, isLast) {
	var menu = document.getElementById(menuid);
	var branch = document.getElementById(branchid);
	var leaf = document.getElementById(leafid);

	if (menu != null && branch != null && leaf != null) {
		if (menu.style.display == "none") {
			menu.style.display = "";
			branch.src = isLast ? resource.minus2 : resource.minus1;
			leaf.src = resource.folder_open;
		} else {
			menu.style.display = "none";
			branch.src = isLast ? resource.plus2 : resource.plus1;
			leaf.src = resource.folder_close;
		}
	}
}

function createHttpRequest() {
	return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
}
