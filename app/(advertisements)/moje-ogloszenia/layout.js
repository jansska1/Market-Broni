export default function UserAdsLayout({ header, inactive }) {
	return (
		<div className='min-h-screen'>
			<section>{header}</section>
			<section>{inactive}</section>
		</div>
	)
}
