<template>
  <course-list :courses="courses" />
</template>

<script lang="ts">
import Vue from 'vue'
import { fetch } from '../../utils/fetch'
import CourseList from '../../components/CourseList.vue'
export default Vue.extend({
  components: {
    'course-list': CourseList
  },
  data() {
    return {
      courses: []
    }
  },
  onLoad() {
    // 获取课程列表数据
    this.getCoursesData()
  },
  methods: {
    async getCoursesData() {
      const res = await fetch({ url: 'course/list' })
      this.courses = res.data.message
    }
  }
})
</script>
