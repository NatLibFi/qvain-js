import apiClient from '@/api/client.js';

export default {
	async getDataset(id) {
		const res = await apiClient.get(`/datasets/${id}`);
		return res.data;
	}
}
