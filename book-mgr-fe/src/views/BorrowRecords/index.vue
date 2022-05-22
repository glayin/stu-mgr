<template>
  <div class="card">
    <a-card>
      <h2>借阅列表</h2>
      <a-divider/>

      <a-table :columns="columns"
               :data-source="list"
               :pagination="false"
      >

        <template #publishDate = "data">
          {{ data.record.publishDate }}
        </template>

        <template #is_return = "data">
          {{ data.record.is_return== true? "已还":"已借" }}
        </template>

        <template #is_overdue = "data">
          {{ data.record.is_overdue== true? "超期":"未超期" }}
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


<script src="./index.js">

</script>

<style scoped>
  @import "./index.scss";
</style>
