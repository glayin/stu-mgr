<template>
  <div class="card">
    <a-card>
      <h2>图书列表</h2>
      <a-divider/>

      <space-between>
        <div class="search">
          <a-input-search
            placeholder="根据书名搜索"
            enter-button
            v-model:value="keyword"
            @search = "onSearch"
          />

          <a v-if="isSearch" href="javascript:;" @click="backAll">返回</a>
        </div>
           <a-button @click="show=true">添加一条</a-button>
      </space-between>
      <a-table :columns="columns"
               :data-source="list"
               :pagination="false"
               >
        <template #count = "data">
          <a href="javascript:;" @click="updateCount('IN_COUNT', data.record)">还书</a>
          {{data.record.count}}
          <a href="javascript:;" @click="updateCount('OUT_COUNT', data.record)">借书</a>
        </template>
        <template #publishDate = "data">
          {{ formatTimeStamp(data.record.publishDate) }}
        </template>



      </a-table>
      <space-between style="margin-top:24px">
        <div />
        <a-pagination
        v-model:current = "curPage"
        :total="total"
        :page-size="10"
        @change="setPage"
        />
      </space-between>
    </a-card>


  </div>
</template>

<script src = "./index.jsx"> </script>
<style lang="scss">
  @import "./index.scss";
</style>
