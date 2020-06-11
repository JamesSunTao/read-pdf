<template>
    <section id="fullNoteWarp">
        <div class="study-l-t">
            <span class="ckwx menu-title"><span>~</span>笔记<span>~</span></span>
        </div>
        <PdfRight :showNav="false"/>
    </section>
</template>

<script>
    import  PdfRight from  '@/components/pdf/PdfRight.vue'
    export default { 
        name: "pdfFullNote",
        components: {
            PdfRight,
        },
    }
</script>

<style scoped>
    #fullNoteWarp{position: absolute;left: auto;right: 0;top: 0;bottom: 0;width: 65%;z-index: 102;background: #fff;box-shadow: 0 0 12px 7px rgba(35,35,37,.3);}
    #fullNoteWarp .study-l-t{position:relative; height:80px;padding: 0 0 0 16px;line-height:80px;text-align:center;font-size:14px;color:#666;background:#fff;z-index: 15;}

</style>
<style>
    #fullNoteWarp .r-hide{top:82px;}
</style>