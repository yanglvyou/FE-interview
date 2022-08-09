/**https://leetcode.cn/problems/remove-duplicates-from-sorted-array/
 * 给你一个 升序排列 的数组 nums ，请你 原地 
 * 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。元素的 相对顺序 应该保持 一致 。
 * @param {number[]} nums
 * @return {number}
 */
 var removeDuplicates = function (nums) {
    const n = nums.length;
    if (n === 0) {
        return 0;
    }
    let fast = 1, slow = 1;
    while (fast < n) {
        if (nums[fast] !== nums[fast - 1]) {
            nums[slow] = nums[fast];
            ++slow;
        }
        ++fast;
    }
    arr.splice(slow);
    return slow;
};