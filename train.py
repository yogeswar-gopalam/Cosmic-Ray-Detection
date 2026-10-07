import os
import cv2
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

# -----------------------------
# 1. Paths Configuration
# -----------------------------
# This detects if we are in Colab or Local VS Code
if os.path.exists("/content/"):
    CLEAN_DIR = "/content/gan_dataset/clean"
    NOISY_DIR = "/content/gan_dataset/noisy"
else:
    CLEAN_DIR = "../gan_dataset/clean"
    NOISY_DIR = "../gan_dataset/noisy"

# -----------------------------
# 2. Dataset Loader
# -----------------------------
class ParticleDataset(Dataset):
    def __init__(self, clean_dir, noisy_dir):
        self.clean_dir = clean_dir
        self.noisy_dir = noisy_dir
        self.images = sorted(os.listdir(clean_dir))

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        name = self.images[idx]
        clean = cv2.imread(os.path.join(self.clean_dir, name), 0)
        noisy = cv2.imread(os.path.join(self.noisy_dir, name), 0)

        if clean is None or noisy is None:
            raise ValueError(f"Error loading {name} from {self.clean_dir}")

        # Ensure consistent size for GAN stability
        clean = cv2.resize(clean, (256, 256))
        noisy = cv2.resize(noisy, (256, 256))

        clean = clean / 255.0
        noisy = noisy / 255.0

        # Convert to Tensors [Channels, Height, Width]
        clean = torch.tensor(clean).float().unsqueeze(0)
        noisy = torch.tensor(noisy).float().unsqueeze(0)

        return noisy, clean

# -----------------------------
# 3. Generator & Discriminator
# -----------------------------
class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Conv2d(1, 64, 4, 2, 1), nn.ReLU(),
            nn.Conv2d(64, 128, 4, 2, 1), nn.BatchNorm2d(128), nn.ReLU(),
            nn.Conv2d(128, 256, 4, 2, 1), nn.BatchNorm2d(256), nn.ReLU()
        )
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(256, 128, 4, 2, 1), nn.BatchNorm2d(128), nn.ReLU(),
            nn.ConvTranspose2d(128, 64, 4, 2, 1), nn.BatchNorm2d(64), nn.ReLU(),
            nn.ConvTranspose2d(64, 1, 4, 2, 1), nn.Sigmoid()
        )
    def forward(self, x):
        return self.decoder(self.encoder(x))

class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(2, 64, 4, 2, 1), nn.LeakyReLU(0.2),
            nn.Conv2d(64, 128, 4, 2, 1), nn.BatchNorm2d(128), nn.LeakyReLU(0.2),
            nn.Conv2d(128, 256, 4, 2, 1), nn.BatchNorm2d(256), nn.LeakyReLU(0.2)
        )
        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d((8, 8)),
            nn.Flatten(),
            nn.Linear(256 * 8 * 8, 1),
            nn.Sigmoid()
        )
    def forward(self, x, y):
        combined = torch.cat([x, y], dim=1)
        return self.classifier(self.features(combined))

# -----------------------------
# 4. Training Function
# -----------------------------
def run_training():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🚀 Training starting on: {device}")

    dataset = ParticleDataset(CLEAN_DIR, NOISY_DIR)
    loader = DataLoader(dataset, batch_size=16, shuffle=True)

    G = Generator().to(device)
    D = Discriminator().to(device)

    criterion_GAN = nn.BCELoss()
    criterion_L1 = nn.L1Loss()
    opt_G = optim.Adam(G.parameters(), lr=0.0002, betas=(0.5, 0.999))
    opt_D = optim.Adam(D.parameters(), lr=0.0001, betas=(0.5, 0.999))

    epochs = 20 # Increased for better results on GPU

    for epoch in range(epochs):
        for noisy, clean in loader:
            noisy, clean = noisy.to(device), clean.to(device)
            
            # --- Train Generator ---
            fake = G(noisy)
            pred_fake = D(noisy, fake)
            loss_G = criterion_GAN(pred_fake, torch.ones_like(pred_fake) * 0.9) + 100 * criterion_L1(fake, clean)
            
            opt_G.zero_grad()
            loss_G.backward()
            opt_G.step()

            # --- Train Discriminator ---
            loss_real = criterion_GAN(D(noisy, clean), torch.ones_like(pred_fake) * 0.9)
            loss_fake = criterion_GAN(D(noisy, fake.detach()), torch.zeros_like(pred_fake))
            loss_D = (loss_real + loss_fake) / 2
            
            opt_D.zero_grad()
            loss_D.backward()
            opt_D.step()

        print(f"Epoch {epoch+1}/{epochs} | G Loss: {loss_G.item():.4f} | D Loss: {loss_D.item():.4f}")

    torch.save(G.state_dict(), "generator_model.pth")
    print("✅ Training Completed. generator_model.pth saved.")

if __name__ == "__main__":
    run_training()