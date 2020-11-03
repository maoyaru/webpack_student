import orderCenter from '@/views/order/orderCenter';
import orderDetail from '@/views/order/orderDetail';

let orderRoutes = [{
  path: '/order/orderCenter',
  component: orderCenter,
  meta: {}
}, {
	path: '/order/orderDetail',
	component: orderDetail,
	meta: {}
}];

export default orderRoutes
