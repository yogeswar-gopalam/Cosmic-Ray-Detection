from django.db import models

# Create your models here.
import torch
import torch.nn as nn

# This class MUST look exactly like the one we used in Colab
class Generator(nn.Module):
    def __init__(self):
        super(Generator, self).__init__()
        self.main = nn.Sequential(
            # These layers are the "bricks" of your AI
            nn.Conv2d(3, 64, 4, 2, 1),
            nn.ReLU(True),
            nn.ConvTranspose2d(64, 3, 4, 2, 1),
            nn.Tanh()
        )

    def forward(self, x):
        return self.main(x)
