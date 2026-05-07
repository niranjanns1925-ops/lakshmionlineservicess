import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function seed() {
    const configPath = join(process.cwd(), 'firebase-applet-config.json');
    const config = JSON.parse(await readFile(configPath, 'utf-8'));
    
    const app = initializeApp(config);
    const db = getFirestore(app, config.firestoreDatabaseId);

    const SEED_SERVICES = [
        {
            name: 'Aadhaar Update',
            category: 'Identity',
            description: 'Update your name, address, or mobile number in your Aadhaar card.',
            icon: '🪪',
            color: '#2563eb',
            fee: 250,
            gst: 45,
            processingDays: '5-7',
            status: 'active',
            requiredDocs: ['Aadhaar Card (front & back)', 'Recent Photo', 'Proof of Identity'],
            requestCount: 42,
            createdAt: serverTimestamp()
        },
        {
            name: 'PAN Card Apply',
            category: 'Finance',
            description: 'New Permanent Account Number (PAN) application for tax purposes.',
            icon: '💳',
            color: '#f59e0b',
            fee: 107,
            gst: 19,
            processingDays: '10-15',
            status: 'active',
            requiredDocs: ['Aadhaar Card', 'Birth Certificate', '2 Passport Photos'],
            requestCount: 28,
            createdAt: serverTimestamp()
        },
        {
            name: 'Income Tax Filing',
            category: 'Finance',
            description: 'File your income tax returns (ITR) efficiently with our expert help.',
            icon: '📄',
            color: '#7c3aed',
            fee: 500,
            gst: 90,
            processingDays: '3-5',
            status: 'active',
            requiredDocs: ['Form 16', 'Bank Statement', 'Investment Proofs'],
            requestCount: 15,
            createdAt: serverTimestamp()
        },
        {
            name: 'TNEB Bill Payment',
            category: 'Utility',
            description: 'Pay your Tamil Nadu Electricity Board bills online instantly.',
            icon: '⚡',
            color: '#eab308',
            fee: 10,
            gst: 2,
            processingDays: 'Instant',
            status: 'active',
            requiredDocs: ['Consumer Number'],
            requestCount: 120,
            createdAt: serverTimestamp()
        },
        {
            name: 'Ration Card Apply',
            category: 'Social Welfare',
            description: 'Apply for a new digital Smart Ration Card for government benefits.',
            icon: '🛡️',
            color: '#0d9488',
            fee: 50,
            gst: 9,
            processingDays: '30',
            status: 'active',
            requiredDocs: ['Address Proof', 'Marriage Certificate', 'Surrender Certificate'],
            requestCount: 12,
            createdAt: serverTimestamp()
        },
        {
            name: 'Birth Certificate',
            category: 'Legal',
            description: 'Apply for official birth certificate issued by the government.',
            icon: '⭐',
            color: '#db2777',
            fee: 100,
            gst: 18,
            processingDays: '15-20',
            status: 'active',
            requiredDocs: ['Discharge Summary', 'Parents Identification', 'Address Proof'],
            requestCount: 35,
            createdAt: serverTimestamp()
        }
    ];

    console.log('Seeding services...');
    for (const service of SEED_SERVICES) {
        await addDoc(collection(db, 'services'), service);
        console.log(`Added ${service.name}`);
    }
    console.log('Seeding admins...');
    const ADMINS = [
        { email: 'admin@lakshmi.gov.in', role: 'Admin' },
        { email: 'niranjanns1925@gmail.com', role: 'Admin' }
    ];
    // We use setDoc here if we knew the UID, but we don't.
    // In production, users are added to admins collection when they register if they have specific emails, 
    // or manually via console.
    // Since we don't have UIDs yet, we can't easily seed the 'admins' collection by UID.
    // However, we can use email as document ID if we change the rules to check email.
    // But our rules currently check UID.
    // So the 'create profile' logic in auth.js is better for this.
    
    console.log('Skipping admin seeding as it requires UIDs - auth.js will handle first-time admin setup.');
    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
