<template>
     <div id="content" class="study-wrap">
            <div class="art-top">
                <div class="top-left" style="display: block;">
                    <a href="#" id="stu-full-screen" title="鍏ㄥ睆">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-quanpingzuidahua"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tuichuquanping"></use>
                        </svg>
                    </a>
                    <a href="#" class="setFontAndBg">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-fontSize"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" id="mindmap" title="瀵煎浘">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-mind"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" title="瀵规瘮" id="compare">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-duibi"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="switch" id="switchReferBook" v-on:click="turnReferBook" v-bind:class="turnReferBookFlag?'cur':''">
                            <span class="switch-w  switch-w-on" v-if="turnReferBookFlag">寮€鍚伐鍏蜂功</span>
                            <span class="switch-w  switch-w-off" v-if="!turnReferBookFlag">鍏抽棴宸ュ叿涔?/span>
                            <i class="switch-btn" v-bind:class="turnReferBookFlag?'':'r-1'"></i>
                        </a>
                    <div class="w-pop-wrap arrow" id="setFontAndBg" style="display: none;">
                        <div class="clearfix">
                            <div class="w-btn-top">
                                <a href="#" class="w-btn js-w-btn-add">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-fontToBig"></use>
                                    </svg>
                                </a>
                                <a href="#" class="w-btn js-w-btn-minus">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-fontToSmall"></use>
                                    </svg>
                                </a>
                                <a href="#" class="w-btn js-w-btn-return">杩樺師</a>
                            </div>
                            <div class="wx-select">
                                <div class="wx-text">
                                    <span class="select-text">寰蒋闆呴粦</span>
                                </div>
                                <ul class="select-up" style="display: none;">
                                    <li>寰蒋闆呴粦</li>
                                    <li>瀹嬩綋</li>
                                    <li>榛戜綋</li>
                                    <li>Arial</li>
                                </ul>
                            </div>
                        </div>
                        <div class="w-btn-group">
                            <a href="#" class="w-btn cur" data-className="cur" data-bgc="#ffffff">鐧借壊</a>
                            <a href="#" class="w-btn w-bjb" data-className="w-bjb" data-bgc="#cce8cf">缁胯壊</a>
                            <a href="#" class="w-btn w-bj0" data-className="w-bj0" data-bgc="#2b2b2b">榛戣壊</a>
                            <a href="#" class="w-btn w-bjy" data-className="w-bjy" data-bgc="#fcf1d9">榛勮壊</a>
                        </div>
                    </div>
                </div>
                <div class="search-top">
                    <input id="searchstr" v-on:keyup.enter="highLight()" type="text" placeholder="鍏抽敭璇嶆煡鎵? class="search-txt">
                    <input id="search_btn" v-on:click="highLight()" type="button" value="鎼滅储" class="search-btn">
                </div>
                <div class="btn-group-sm js-switchpaneltype posr">
                    <a href="javascript:;" v-on:click='toggleContent ("origin")' v-bind:class="{'cur':contentText=='origin'}" class="top-btn js-panel1">鍘熸枃</a>
                    <a href="javascript:;" v-on:click='toggleContent ("originNote")' v-bind:class="{'cur':contentText=='originNote'}" class="top-btn js-panel2">鍘熸枃<span class="st js-plus">+</span>绗旇</a>
                    <a href="javascript:;" v-on:click='toggleContent ("note")' v-bind:class="{'cur':contentText=='note'}" class="top-btn js-panel3">鍏ㄩ儴绗旇</a>
                    <!-- 鍏ㄩ儴绗旇涓夌瑙嗗浘 -->
                    <div class="view-box arrow" v-if="contentText=='note'">
                        <ul>
                            <li>
                                <a href="#" v-on:click="toggleNoteType('noteList')" v-bind:class="{'cur':noteType=='noteList'}" title="鍒楄〃(鎸夋枃鐚爣棰?">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-list_icon"></use>
                                    </svg>
                                    鎸夋枃鐚爣棰?
                                </a>
                            </li>
                            <li>
                                <a href="#" v-on:click="toggleNoteType('noteTree')" v-bind:class="{'cur':noteType=='noteTree'}" title="鏍戝舰(鎸夌瑪璁版爣绛?">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-jiegou"></use>
                                    </svg>
                                    鎸夌瑪璁版爣绛?
                                </a>
                            </li>
                            <li>
                                <a href="#" v-on:click="toggleNoteType('noteNet')" v-bind:class="{'cur':noteType=='noteNet'}" title="缃戠姸(鎸夊紩鐢ㄥ叧绯?">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-atlas"></use>
                                    </svg>
                                    鎸夊紩鐢ㄥ叧绯?
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="study-cen" id="study-cen">
                <!-- 鏂囨。鍐呭 -->
                <div class="art-hide" id="artHideBox">
                    <!--绗旇鏍囪-->
                    <div class="notes-mark-box" id="mincon"></div>
                    <!-- 鏂囨。鍐呭 wrapper-->
                    <div id="ChapterContainerWrap" class="ChapterContainerWrap" v-if="!showFlag1">
                        <div class="rangeOperat annotator-adder js_rangeOperat" id="js_rangeOperat">
                            <button id="noteUnderLine" class="annotator-adder-btn">鍒掔嚎</button>
                            <button id="setHighlight" class="annotator-adder-btn">绗旇</button>
                            <button id="excerpt" class="annotator-adder-btn">鏂囨憳</button>
                            <button id="referBookSearch" class="annotator-adder-btn">宸ュ叿涔︽悳绱?/button>
                            <button id="lineCopy" class="annotator-adder-btn">澶嶅埗</button>
                            <button id="lineShare" class="annotator-adder-btn annotator-adder-btn-r">鍒嗕韩</button>
                        </div>
                        <div id="divforshare" style="display: none;">
                           
                        </div>
                        <!-- 鏂囨。鍐呭 content -->
                        <div class="ChapterContainer" id="paperRead">
                            <div class="js-originalText" v-if="contentText=='origin'" v-bind:key="'origin'" v-cloak>
                                <div class="ChapterWrap ChapterH1 js-prefix" v-if="!!paperTitle">
                                    <h1 class="Chapter">{{paperTitle}}</h1>
                                </div>
                                <div class="ChapterWrap ChapterMsg js-prefix" data-id="f3d04fd1-c677-11e6-a53d-005056ad2014">
                                    <ul role="para" class="para Chapter-people" id="1000001">
                                        <li v-for="(item,index) in authors"  v-bind:key="index">
                                            <a v-bind:href="item.Personinfo.NameLink" target="_blank">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-people"></use>
                                                </svg>{{item.Personinfo.FullName}}
                                            </a>
                                            <small>
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-bookSmall"></use>
                                                </svg>
                                            </small>
                                        </li>
                                    </ul>
                                    <ul role="para" class="para Chapter-people" id="1000002" v-if="organizationInfos.length>0">
                                        <li v-for="(item,index) in organizationInfos" v-bind:key="index">
                                            <a v-bind:href="item.OrgNameLink" target="_blank">{{item.OrganizationName}}</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="ChapterWrap ChapterP js-prefix" data-id="0d80088b-c678-11e6-a53d-005056ad2014" v-if="!!Abstract">
                                    <div role="para" class="para" id="1000006">
                                        <i class="bfc-l">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-zhuxiangmu"></use>
                                            </svg>
                                        </i>
                                        <p class="ovhide" data-id="0d80088b-c678-11e6-a53d-005056ad2014-P1000006-Pundefined">
                                            <span class="b">鎽樿:</span>
                                            <span v-text="Abstract"></span>
                                        </p>
                                    </div>
                                </div>
                                <div class="ChapterWrap ChapterP js-prefix" data-id="0d80088b-c678-11e6-a53d-005056ad2014">
                                    <div role="para" class="para" id="1000005" v-if="!!Funds && Funds.length > 0">
                                        <i class="bfc-l">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-file"></use>
                                            </svg>
                                        </i>
                                        <p class="ovhide" data-id="0d80088b-c678-11e6-a53d-005056ad2014-P1000005-Pundefined">
                                            <span class="b">鍩洪噾锛?/span>
                                            <a v-bind:href="item.FundLink" target="_blank" v-for="(item,index) in Funds" v-bind:key="index">{{item.Fund}} </a>
                                        </p>
                                    </div>
                                </div>
                                <div class="ChapterWrap ChapterP mb50 js-prefix" data-id="16dbe71f-c678-11e6-a53d-005056ad2014" v-if="!!Keywords && Keywords.length > 0">
                                    <div role="para" class="para" id="1000007">
                                        <i class="bfc-l">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-guanjianci"></use>
                                            </svg>
                                        </i>
                                        <p class="ovhide" data-id="16dbe71f-c678-11e6-a53d-005056ad2014-P1000007-Pundefined">
                                            <span class="b">鍏抽敭璇?</span>
                                            <span v-for="(item,index) in Keywords" v-bind:key="index">
                                                <a v-bind:href="item.KeywordLink" target="_blank">{{item.Keyword}}</a>
                                                <a v-bind:href="item.KeywordLink" target="_blank" class="co">
                                                    <svg class="icon" aria-hidden="true">
                                                        <use xlink:href="#icon-tubiaofenxi"></use>
                                                    </svg>
                                                </a>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div class="ChapterWrap Content" v-bind:data-id="PrefixId" v-html="Prefix" v-if="!!Prefix">
                                </div>
                                <div v-html="Content"></div>
                            </div>
                            <div class="js-studyAchievement" v-else-if="contentText=='originNote'" v-bind:key="'originnote'" v-cloak>
                                <div class="ChapterWrap ChapterH1 js-prefix" v-if="!!paperTitle">
                                    <h1 class="Chapter">{{paperTitle}}</h1>
                                </div>
                                <div class="ChapterWrap ChapterMsg js-prefix" data-id="f3d04fd1-c677-11e6-a53d-005056ad2014">
                                    <ul role="para" class="para Chapter-people" id="1000001">
                                        <li v-for="(item,index) in authors" v-bind:key="index">
                                            <a v-bind:href="item.Personinfo.NameLink" target="_blank">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-people"></use>
                                                </svg>{{item.Personinfo.FullName}}
                                            </a>
                                            <small>
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-bookSmall"></use>
                                                </svg>
                                            </small>
                                        </li>
                                    </ul>
                                    <ul role="para" class="para Chapter-people" id="1000002" v-if="organizationInfos.length>0">
                                        <li v-for="(item,index) in organizationInfos" v-bind:key="index">
                                            <a v-bind:href="item.OrgNameLink" target="_blank">{{item.OrganizationName}}</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="ChapterWrap ChapterP js-prefix" data-id="0d80088b-c678-11e6-a53d-005056ad2014" v-if="!!Abstract">
                                    <div role="para" class="para" id="1000006">
                                        <i class="bfc-l">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-zhuxiangmu"></use>
                                            </svg>
                                        </i>
                                        <p class="ovhide" data-id="0d80088b-c678-11e6-a53d-005056ad2014-P1000006-Pundefined">
                                            <span class="b">鎽樿:</span>
                                            <span v-text="Abstract"></span>
                                        </p>
                                    </div>
                                </div>
                                <div class="ChapterWrap ChapterP js-prefix" data-id="0d80088b-c678-11e6-a53d-005056ad2014">
                                    <div role="para" class="para" id="1000005" v-if="!!Funds && Funds.length > 0">
                                        <i class="bfc-l">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-file"></use>
                                            </svg>
                                        </i>
                                        <p class="ovhide" data-id="0d80088b-c678-11e6-a53d-005056ad2014-P1000005-Pundefined">
                                            <span class="b">鍩洪噾锛?/span>
                                            <a v-bind:href="item.FundLink" target="_blank" v-for="(item,index) in Funds" v-bind:key="index">{{item.Fund}} </a>
                                        </p>
                                    </div>
                                </div>
                                <div class="ChapterWrap ChapterP mb50 js-prefix" data-id="16dbe71f-c678-11e6-a53d-005056ad2014" v-if="!!Keywords && Keywords.length > 0">
                                    <div role="para" class="para" id="1000007">
                                        <i class="bfc-l">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-guanjianci"></use>
                                            </svg>
                                        </i>
                                        <p class="ovhide" data-id="16dbe71f-c678-11e6-a53d-005056ad2014-P1000007-Pundefined">
                                            <span class="b">鍏抽敭璇?</span>
                                            <span v-for="(item,index) in Keywords" v-bind:key="index">
                                                <a v-bind:href="item.KeywordLink" target="_blank">{{item.Keyword}}</a>
                                                <a v-bind:href="item.KeywordLink" target="_blank" class="co">
                                                    <svg class="icon" aria-hidden="true">
                                                        <use xlink:href="#icon-tubiaofenxi"></use>
                                                    </svg>
                                                </a>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div class="ChapterWrap Content" v-show="!!catlogInfos && catlogInfos.length > 0"
                                     v-for="(item,index) in catlogInfos"
                                     v-bind:data-id="item.Id"
                                     v-html="item.Content" v-bind:key="index">

                                </div>
                                <div id="rightaddnote" v-show="showRightAddNote">
                                    <div class="IndicatorBar" style="right:0px">
                                        <a href="javascript:void(0)" class="js-add comment-btn-link" title="娈佃惤/绔犺妭绗旇" v-on:click.stop="curParaId=willParaId">...</a>
                                    </div>
                                    <ul class="set-list para" v-if="curParaId!=''">
                                        <li>
                                            <a href="#" v-on:click.stop="addNote(curPara.ParaDataId,curPara.ParentDataId,{'Quote':curNoteParaHtml,'type':1})">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-note_add"></use>
                                                </svg>
                                                娣诲姞娈佃惤绗旇
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" v-on:click.stop="paraSurround(curPara,2,curPara.ParentDataId)">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-note_front"></use>
                                                </svg>
                                                娈靛墠娣诲姞鍐呭
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" v-on:click.stop="paraSurround(curPara,3,curPara.ParentDataId)">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-note_front"></use>
                                                </svg>
                                                娈靛悗娣诲姞鍐呭
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" v-on:click.stop="deletePara(curPara.ParentDataId,curPara)">鍒犻櫎娈佃惤</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div id="allNotes" v-else-if="contentText=='note'">
                                <allnotelist-component v-if="noteType=='noteList'" v-bind:src-note-list="notes"></allnotelist-component>
                                <!-- @Url.Action("notemindmap", "mind") -->
                                <iframe id="allNoteTree" v-bind:key="'noteTree'" width="100%" height="100%" align="center" v-else-if="noteType=='noteTree'" src=""></iframe>
                                <!-- @Url.Action("notemindmap", "mind") -->
                                <iframe id="allNoteNet" v-bind:key="'noteNet'" width="100%" height="100%" align="center" v-else src=""></iframe>
                            </div>
                        </div>
                        <div class="IndicatorBarContainer js-originalTextShow">
                        </div>
                    </div>
                </div>
            </div>
            <notedetail-component v-if="noteDetail" v-bind:notes="curNote" v-bind:cur-note-para-html="curNoteParaHtml"> </notedetail-component>
        </div>
</template>
<style src="@/assets/css/xmlContent.css"></style>
<script>
    export default {
        name:'XmlContent'
    }
</script>