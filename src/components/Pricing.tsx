
const features = [
    {
        name: 'Basic Platform Access',
        free: '✅',
        starter: '✅',
        enterprise: '✅'
    },
    {
        name: 'Influencer Search & Discovery',
        free: 'Basic filters',
        starter: '✅',
        enterprise: '✅'
    },
    {
        name: 'Brand Campaign Management',
        free: '❌',
        starter: '✅',
        enterprise: '✅'
    },
    {
        name: 'Analytics & Reporting',
        free: 'Basic analytics',
        starter: '✅',
        enterprise: '✅'
    },
    {
        name: 'Influencer Performance Tracking',
        free: 'Basic details',
        starter: '✅',
        enterprise: 'Custom KPI dashboard'
    },
    {
        name: 'Messaging & Collaboration',
        free: 'Limited',
        starter: '✅',
        enterprise: 'CRM integration'
    },
    {
        name: 'Influencer Bucket (My Creators)',
        free: '✅',
        starter: '✅',
        enterprise: '✅'
    },
    {
        name: 'URL Tracking for Campaigns',
        free: '❌',
        starter: '✅',
        enterprise: '✅'
    },
    {
        name: 'Custom Branding (White-Labeling)',
        free: '❌',
        starter: '❌',
        enterprise: '✅'
    },
    {
        name: 'Influencer Portfolio & Verification',
        free: '❌',
        starter: '✅',
        enterprise: '✅'
    },
    {
        name: 'Priority Support',
        free: '❌',
        starter: 'Dedicated Account Manager',
        enterprise: 'Dedicated Account and Implementation Manager'
    }
];

export default function PremiumFeatureTable() {
    return (
        <div className="overflow-x-auto m-4 rounded-lg border shadow-lg bg-white">
            <table className="min-w-full shadow-lg rounded-2xl">
                <thead className="rounded-t-lg bg ">
                    <tr className=" text-white text-left text-sm md:text-base">
                        <th className="p-3 border-b">Feature</th>
                        <th className="p-3 border-b">Free</th>
                        <th className="p-3 border-b">Starter ($99/mo)</th>
                        <th className="p-3 border-b">Enterprise</th>
                    </tr>
                </thead>
                <tbody className="text-sm md:text-base">
                    {features.map((feature, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-3 border-b font-medium text-gray-800">{feature.name}</td>
                            <td className="p-3 border-b">{feature.free}</td>
                            <td className="p-3 border-b">{feature.starter}</td>
                            <td className="p-3 border-b">{feature.enterprise}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
